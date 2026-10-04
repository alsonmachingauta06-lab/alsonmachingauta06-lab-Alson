export default {
  name: ['info', 'botinfo'],
  description: 'Shows bot information and statistics',
  category: 'General',
  usage: 'info',
  async execute({ sock, msg, config, commands }) {
    const text = `🤖 *${config.botName} Information*\n\n` +
                 `▫️ Platform: Node.js / Baileys Multi-Device\n` +
                 `▫️ Prefix: ${config.prefix || '(none)'}\n` +
                 `▫️ Total Plugins: ${commands.size}\n` +
                 `▫️ Owners: ${config.ownerNumbers.length} Verified Owners\n` +
                 `> Powered by Google Gemini AI & ALSON-XMD`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
};
