export default {
  name: ['alive'],
  description: 'Checks if the bot is active and running',
  category: 'General',
  usage: 'alive',
  async execute({ sock, msg, config }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const menuCmd = config.prefix ? `${config.prefix}menu` : 'menu';

    const text = `╭━━━〔 *${config.botName} STATUS* 〕━━━┈\n` +
                 `┃ ✅ Status: Online & Active\n` +
                 `┃ ⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                 `┃ 🚀 Platform: Node.js / Baileys\n` +
                 `╰━━━━━━━━━━━━━━━━━━━━━━━┈\n\n` +
                 `Type *${menuCmd}* to view commands.`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
};
