import { askAI } from '../lib/ai/index.js';
import { config } from '../config/index.js';

export default {
  name: ['ai', 'ask', 'gemini', 'chat'],
  description: 'Ask questions or chat with ALSON-XMD AI Assistant',
  category: 'AI',
  usage: 'ai <your prompt>',
  ownerOnly: false,
  async execute({ sock, msg, text }) {
    if (!text) {
      const p = config.prefix;
      await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Please provide a prompt. Example: *${p}ai What is Node.js?*` }, { quoted: msg });
      return;
    }

    try {
      await sock.sendMessage(msg.key.remoteJid, { text: '🧠 Thinking...' }, { quoted: msg });

      const replyText = await askAI(text);

      await sock.sendMessage(msg.key.remoteJid, { text: `🤖 *${config.pairingBrand} AI Assistant*\n\n${replyText}` }, { quoted: msg });
    } catch (err) {
      console.error('[AI Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ AI Error: ${err.message}` }, { quoted: msg });
    }
  }
};
