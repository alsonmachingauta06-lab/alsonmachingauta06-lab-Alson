import { config } from '../config/index.js';
import { askAI } from '../lib/ai/index.js';
import { botMode } from './botMode.js';

export async function handleMessage(sock, m, commands) {
  try {
    if (!m.messages || !m.messages[0]) return;
    const msg = m.messages[0];
    if (!msg.message) return;
    if (msg.key && msg.key.fromMe) return; // Ignore messages from bot itself

    const body = 
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      '';

    if (!body) return;

    const prefix = config.prefix; // e.g. '.' or '' (none)
    let commandName = '';
    let args = [];
    let isCommand = false;

    if (prefix && body.startsWith(prefix)) {
      args = body.slice(prefix.length).trim().split(/ +/);
      commandName = args.shift()?.toLowerCase();
      isCommand = true;
    } else if (!prefix) {
      // Prefix disabled mode: check if first word matches a command
      const potentialArgs = body.trim().split(/ +/);
      const potentialCmd = potentialArgs[0]?.toLowerCase();
      if (potentialCmd && commands.has(potentialCmd)) {
        args = potentialArgs;
        commandName = args.shift()?.toLowerCase();
        isCommand = true;
      }
    }

    if (isCommand && commandName) {
      const command = commands.get(commandName);
      if (command) {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const senderNumber = senderJid ? senderJid.replace(/[^0-9]/g, '') : '';
        const isOwner = config.ownerNumbers.includes(senderNumber);

        // Check private mode restriction for non-owners
        if (botMode.isPrivate() && !isOwner) {
          await sock.sendMessage(msg.key.remoteJid, { text: `🔒 ${config.pairingBrand} is currently in PRIVATE mode.` }, { quoted: msg });
          return;
        }

        if (command.ownerOnly && !isOwner) {
          await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ This command is restricted to bot owners only.' }, { quoted: msg });
          return;
        }

        const context = {
          sock,
          msg,
          args,
          text: args.join(' '),
          senderJid,
          senderNumber,
            isOwner,
          commandName,
          config,
          commands
        };

        console.log(`[ALSON-XMD CommandHandler] Executing ${prefix ? prefix : ''}${commandName} from ${senderNumber} (${isOwner ? 'Owner' : 'User'})`);
        await command.execute(context);
        return;
      }
    }

    // If not a command, check if automatic chatbot replies are enabled
    if (config.chatbotEnabled && !isCommand) {
      const remoteJid = msg.key.remoteJid;
      const isGroup = remoteJid.endsWith('@g.us');

      if ((isGroup && config.chatbotGroups) || (!isGroup && config.chatbotPrivate)) {
        console.log(`[ALSON-XMD Chatbot] Auto-responding to message in ${isGroup ? 'group' : 'private'}: ${body}`);
        try {
          const replyText = await askAI(body);
          await sock.sendMessage(remoteJid, { text: `🤖 *${config.pairingBrand} AI*\n\n${replyText}` }, { quoted: msg });
        } catch (err) {
          console.error('[ALSON-XMD Chatbot Error]:', err);
        }
      }
    }

  } catch (err) {
    console.error('[ALSON-XMD CommandHandler] Error in message handler:', err);
  }
}
