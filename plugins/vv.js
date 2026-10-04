import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: ['vv', 'viewonce', 'retrieveyv'],
  description: 'Retrieves View Once media (image/video) and sends it back normally',
  category: 'Tools',
  usage: 'vv (reply to view-once media)',
  ownerOnly: false,
  async execute({ sock, msg, config }) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (!quoted) {
        await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Please reply to a View Once image or video message with *${config.prefix || ''}vv*.` }, { quoted: msg });
        return;
      }

      // Check if quoted message is view once (imageMessage or videoMessage inside viewOnceMessage / viewOnceMessageV2)
      let viewOnceContent = 
        quoted.viewOnceMessage?.message || 
        quoted.viewOnceMessageV2?.message ||
        (quoted.imageMessage?.viewOnce ? quoted : null) ||
        (quoted.videoMessage?.viewOnce ? quoted : null);

      // If wrapped in viewOnceMessage structure
      const mediaMessage = viewOnceContent?.imageMessage || viewOnceContent?.videoMessage || quoted.imageMessage || quoted.videoMessage;

      if (!mediaMessage || !mediaMessage.viewOnce) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ The replied message is not a View Once media message.` }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `⏳ Retrieving View Once media...` }, { quoted: msg });

      // Construct dummy message object for downloadMediaMessage
      const pseudoMsg = {
        key: msg.message.extendedTextMessage.contextInfo.stanzaId,
        message: viewOnceContent || quoted
      };

      const buffer = await downloadMediaMessage(
        pseudoMsg,
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      if (!buffer) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to download View Once media buffer.` }, { quoted: msg });
        return;
      }

      const caption = `🔓 *${config.pairingBrand} View Once Retrieved*\n${mediaMessage.caption || ''}`;

      if (mediaMessage.mimetype?.includes('image')) {
        await sock.sendMessage(msg.key.remoteJid, { image: buffer, caption }, { quoted: msg });
      } else if (mediaMessage.mimetype?.includes('video')) {
        await sock.sendMessage(msg.key.remoteJid, { video: buffer, caption }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, { document: buffer, mimetype: mediaMessage.mimetype || 'application/octet-stream', fileName: 'media' }, { quoted: msg });
      }

    } catch (err) {
      console.error('[VV Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to retrieve View Once media. WhatsApp may have blocked retrieval.` }, { quoted: msg });
    }
  }
};
