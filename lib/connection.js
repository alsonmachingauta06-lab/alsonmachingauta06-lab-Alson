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

  if (onMessageCallback) {
    sock.ev.on('messages.upsert', (m) => onMessageCallback(sock, m));
  }

  return sock;
}
