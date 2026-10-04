export default {
  name: ['menu', 'start'],
  description: 'Displays the list of available bot commands',
  category: 'General',
  usage: 'menu',
  async execute({ sock, msg, config, commands }) {
    const botName = config.botName;
    const prefix = config.prefix;
    const prefixDisplay = prefix ? prefix : '(none)';

    const categories = {};
    for (const [name, cmd] of commands.entries()) {
      const cat = cmd.category || 'General';
      if (!categories[cat]) categories[cat] = [];
      if (!categories[cat].includes(name)) {
        categories[cat].push({ name, usage: cmd.usage, description: cmd.description, ownerOnly: cmd.ownerOnly });
      }
    }

    let menuText = `╭━━━〔 *${botName} COMMANDS* 〕━━━┈\n`;
    menuText += `┃ 🤖 Bot Name: ${botName}\n`;
    menuText += `┃ ⚡ Prefix: [ ${prefixDisplay} ]\n`;
    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━┈\n\n`;

    for (const [cat, cmds] of Object.entries(categories)) {
      menuText += `┌── *${cat.toUpperCase()}* ──\n`;
      for (const c of cmds) {
        const cmdString = prefix ? `${prefix}${c.name}` : c.name;
        const ownerTag = c.ownerOnly ? ' 🛡️' : '';
        menuText += `│ ▫️ ${cmdString}${ownerTag} - ${c.description}\n`;
      }
      menuText += `└───────────────\n\n`;
    }

    menuText += `> Powered by Baileys & ALSON-XMD`;

    await sock.sendMessage(msg.key.remoteJid, { text: menuText }, { quoted: msg });
  }
};
