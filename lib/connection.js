import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode';
import { config } from '../config/index.js';
import { requestPairingCode } from '../pair.js';
import { checkFfmpeg } from '../lib/media/converter.js';
import { isIntentionalLogout } from './antiBot.js';
import { antiCallManager } from './antiCall.js';
import { antiEditManager } from './antiEdit.js';

export let activeSock = null;
export let latestQR = null;
export let pairingCodeGenerated = null;
export let connectionStatus = 'disconnected'; // 'disconnected', 'connecting', 'connected', 'qr_ready', 'pairing_ready'

export async function startWhatsAppBot(onMessageCallback) {
  if (isIntentionalLogout) {
    console.log('[ALSON-XMD Connection] Bot has been intentionally unpaired. Skipping startup until re-paired.');
    connectionStatus = 'disconnected';
    return null;
  }

  // Check ffmpeg binary on startup
  await checkFfmpeg();

  const logger = pino({ level: 'silent' });
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log(`[ALSON-XMD Connection] Using Baileys v${version.join('.')}, isLatest: ${isLatest}`);
  connectionStatus = 'connecting';

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    browser: [config.botName, 'Chrome', '10.0']
  });

  activeSock = sock;

  // Handle Default Pairing Code on startup if not registered and pairing number is provided
  if (!sock.authState.creds.registered && config.pairingNumber && !isIntentionalLogout) {
    setTimeout(async () => {
      try {
        const result = await requestPairingCode(sock, config.pairingNumber);
        if (result.success && result.code) {
          pairingCodeGenerated = result.code;
          connectionStatus = 'pairing_ready';
          console.log(`\n========================================`);
          console.log(` ${config.pairingBrand} PAIRING CODE: ${result.code}`);
          console.log(`========================================\n`);
        }
      } catch (err) {
        console.error('[ALSON-XMD Connection] Failed startup pairing request:', err);
      }
    }, 4000);
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !isIntentionalLogout) {
      latestQR = qr;
      connectionStatus = 'qr_ready';
      try {
        qrcode.toString(qr, { type: 'terminal', small: true }, (err, url) => {
          if (!err && url) console.log(url);
        });
      } catch (e) {
        console.log(`[${config.pairingBrand}] QR Code received.`);
      }
    }

    if (connection === 'open') {
      connectionStatus = 'connected';
      latestQR = null;
      pairingCodeGenerated = null;
      console.log(`\n========================================`);
      console.log(` SUCCESS: ${config.botName} is connected to WhatsApp!`);
      console.log(`========================================\n`);
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(`[ALSON-XMD Connection] Connection closed due to: ${lastDisconnect?.error}, statusCode: ${statusCode}`);

      if (isIntentionalLogout || statusCode === DisconnectReason.loggedOut) {
        connectionStatus = 'disconnected';
        console.log('[ALSON-XMD Connection] Device logged out or intentionally unpaired. Reconnection suppressed.');
      } else {
        connectionStatus = 'connecting';
        console.log('[ALSON-XMD Connection] Reconnecting...');
        setTimeout(() => startWhatsAppBot(onMessageCallback), 3000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Anti-Call Event Handler
  sock.ev.on('call', async (calls) => {
    for (const call of calls) {
      if (call.status === 'offer' && antiCallManager.isEnabled()) {
        console.log(`[AntiCall] Rejecting incoming call from ${call.from}`);
        try {
          await sock.rejectCall(call.id, call.from);
        } catch (err) {
          console.error('[AntiCall] Failed to reject call:', err);
        }
      }
    }
  });

  // Anti-Edit Event Handler
  sock.ev.on('messages.update', async (updates) => {
    if (!antiEditManager.isEnabled()) return;
    for (const update of updates) {
      const msgUpdate = update.update;
      if (msgUpdate && msgUpdate.message) {
        const protocolMsg = msgUpdate.message.protocolMessage;
        const editedMsg = msgUpdate.message.editedMessage || (protocolMsg?.editedMessage);
        const targetId = protocolMsg?.key?.id || update.key?.id;

        if (targetId) {
          const cached = antiEditManager.getCachedMessage(targetId);
          if (cached) {
            const newText = 
              editedMsg?.conversation ||
              editedMsg?.extendedTextMessage?.text ||
              editedMsg?.imageMessage?.caption ||
              editedMsg?.videoMessage?.caption ||
              '*(edited/media)*';

            if (cached.text !== newText) {
              const remoteJid = update.key.remoteJid || cached.remoteJid;
              const alertText = `✏️ *ALSON-XMD Anti-Edit Intercept*\n\n` +
                `👤 *User:* @${cached.participant.replace(/[^0-9]/g, '')}\n` +
                `📌 *Original Message:* "${cached.text}"\n` +
                `✏️ *Edited To:* "${newText}"`;

              try {
                await sock.sendMessage(remoteJid, {
                  text: alertText,
                  mentions: [cached.participant]
                });
              } catch (err) {
                console.error('[AntiEdit] Failed to send anti-edit notification:', err);
              }
            }
          }
        }
      }
    }
  });

  sock.ev.on('messages.upsert', (m) => {
    if (m.messages && m.messages[0]) {
      antiEditManager.cacheMessage(m.messages[0]);
    }
    if (onMessageCallback) {
      onMessageCallback(sock, m);
    }
  });

  return sock;
}
