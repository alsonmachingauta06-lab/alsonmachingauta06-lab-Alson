import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: ['uptime', 'id', 'getlid', 'url', 'caption', 'convert', 'getimage'],
  description: 'Additional utility and media tools powered by ALSON-XMD',
  category: 'Utility',
  usage: 'uptime | id | getlid | url | caption | convert <text> | getimage',
  async execute({ sock, msg, args, commandName, config }) {
    const remoteJid = msg.key.remoteJid;
    let replyText = '';

    switch (commandName) {
      case 'uptime':
        const uptimeSeconds = process.uptime();
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        replyText = `⏱️ *ALSON-XMD Uptime*\n\nRunning for: *${hours}h ${minutes}m ${seconds}s*`;
        break;

      case 'id':
        replyText = `📌 *Chat & Sender IDs*\n\nChat ID: \`${remoteJid}\`\nSender ID: \`${msg.key.participant || remoteJid}\``;
        break;

      case 'getlid':
        replyText = `🆔 *LID Information*\n\nChat JID: \`${remoteJid}\`\nUser LID: \`${msg.key.participant || remoteJid}\``;
        break;

      case 'url':
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const textContent = quotedMsg?.conversation || quotedMsg?.extendedTextMessage?.text || args.join(' ');
        const urlMatch = textContent.match(/https?:\/\/[^\s]+/g);
        if (urlMatch && urlMatch.length > 0) {
          replyText = `🔗 *Extracted URLs*\n\n` + urlMatch.join('\n');
        } else {
          replyText = `❌ No valid URL found in the message or quoted text.`;
        }
        break;

      case 'caption':
        const qMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const captionText = qMsg?.imageMessage?.caption || qMsg?.videoMessage?.caption || 'No caption found in quoted message.';
        replyText = `📝 *Media Caption*\n\n${captionText}`;
        break;

      case 'convert':
        const action = args[0]?.toLowerCase();
        const query = args.slice(1).join(' ');
        if (action === 'upper' && query) {
          replyText = query.toUpperCase();
        } else if (action === 'lower' && query) {
          replyText = query.toLowerCase();
        } else if (action === 'base64' && query) {
          replyText = Buffer.from(query).toString('base64');
        } else {
          replyText = `🔄 *ALSON-XMD Converter*\n\nUsage: \`${config.prefix}convert <upper|lower|base64> <text>\``;
        }
        break;

      case 'getimage':
        const quotedImg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedImg?.imageMessage) {
          try {
            const stream = await downloadMediaMessage({ message: quotedImg }, 'buffer', {});
            await sock.sendMessage(remoteJid, { image: stream, caption: '🖼️ Retrieved image via ALSON-XMD getimage.' }, { quoted: msg });
            return;
          } catch (err) {
            replyText = `❌ Failed to download image: ${err.message}`;
          }
        } else {
          replyText = `❌ Please reply to an image message with \`${config.prefix}getimage\`.`;
        }
        break;

      default:
        replyText = `🛠️ ALSON-XMD Utility Tool`;
    }

    if (replyText) {
      await sock.sendMessage(remoteJid, { text: replyText }, { quoted: msg });
    }
  }
};
