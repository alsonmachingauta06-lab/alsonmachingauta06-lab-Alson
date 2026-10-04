import { publishStatus } from '../lib/status.js';

export default {
  name: ['togstatus', 'poststatus', 'status'],
  description: 'Publishes replied-to media or text as a WhatsApp Status (Owner Only)',
  category: 'Owner',
  usage: 'togstatus (reply to image, video, audio, or text)',
  ownerOnly: true,
  async execute({ sock, msg, config }) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (!quoted) {
        const usageCmd = config.prefix ? `${config.prefix}togstatus` : 'togstatus';
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `⚠️ Reply to an image, video, audio, or text message with *${usageCmd}*.` 
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `⏳ Publishing content as WhatsApp Status (${config.pairingBrand})...` }, { quoted: msg });

      const result = await publishStatus(sock, quoted, msg);

      if (!result.success) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to publish status: ${result.error}` }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Successfully published *${result.type}* content as WhatsApp Status!` }, { quoted: msg });

    } catch (err) {
      console.error('[TogStatus Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ An unexpected error occurred while publishing Status.` }, { quoted: msg });
    }
  }
};
