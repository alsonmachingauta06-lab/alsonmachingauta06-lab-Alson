import { requestPairingCode } from '../pair.js';

export default {
  name: ['pair'],
  description: 'Requests a WhatsApp pairing code for another phone number (Owner Only)',
  category: 'Owner',
  usage: '.pair <phone_number>',
  ownerOnly: true,
  async execute({ sock, msg, text, config }) {
    if (!text) {
      const usageExample = config.prefix ? `${config.prefix}pair 263783549857` : `pair 263783549857`;
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `⚠️ Please provide a phone number.\nExample: *${usageExample}*` 
      }, { quoted: msg });
      return;
    }

    await sock.sendMessage(msg.key.remoteJid, { text: `⏳ Requesting ${config.pairingBrand} pairing code...` }, { quoted: msg });

    try {
      const result = await requestPairingCode(sock, text);

      if (!result.success) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Failed to generate pairing code: ${result.error}` 
        }, { quoted: msg });
        return;
      }

      const replyText = `╭━━━〔 *${config.pairingBrand} PAIRING* 〕━━━┈\n` +
                        `┃ ✅ Number: +${result.cleanedNumber}\n` +
                        `┃ 🔑 Pairing Code: *${result.code}*\n` +
                        `╰━━━━━━━━━━━━━━━━━━━━━━━┈\n\n` +
                        `> Open WhatsApp -> Linked Devices -> Link a Device -> Link with phone number instead.`;

      await sock.sendMessage(msg.key.remoteJid, { text: replyText }, { quoted: msg });
    } catch (err) {
      console.error('[Pair Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ An unexpected error occurred while generating the pairing code.` 
      }, { quoted: msg });
    }
  }
};
