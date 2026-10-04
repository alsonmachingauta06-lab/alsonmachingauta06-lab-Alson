export default {
  name: ['runtime', 'uptime'],
  description: 'Shows bot server uptime',
  category: 'General',
  usage: 'runtime',
  async execute({ sock, msg, config }) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const text = `⏱️ *${config.pairingBrand} Server Runtime*\n\n` +
                 `${days}d ${hours}h ${minutes}m ${seconds}s`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
};
