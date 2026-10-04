export default {
  name: ['help'],
  description: 'Shows help information for bot usage',
  category: 'General',
  usage: 'help [command]',
  async execute({ sock, msg, args, config, commands }) {
    const p = config.prefix;
    if (args.length > 0) {
      const cmdName = args[0].toLowerCase().replace(p, '');
      const cmd = commands.get(cmdName);
      if (!cmd) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Command *${p}${cmdName}* not found.` }, { quoted: msg });
        return;
      }
      let info = `╭━━━〔 *COMMAND INFO* 〕━━━┈\n`;
      info += `┃ 📌 Name: ${p}${cmdName}\n`;
      info += `┃ 📝 Description: ${cmd.description}\n`;
      info += `┃ 📂 Category: ${cmd.category}\n`;
      info += `┃ 🔑 Usage: ${p}${cmd.usage}\n`;
      info += `┃ 🛡️ Owner Only: ${cmd.ownerOnly ? 'Yes' : 'No'}\n`;
      info += `╰━━━━━━━━━━━━━━━━━━━━━━━┈`;
      await sock.sendMessage(msg.key.remoteJid, { text: info }, { quoted: msg });
    } else {
      const helpCmd = p ? `${p}help <command>` : 'help <command>';
      const menuCmd = p ? `${p}menu` : 'menu';
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `💡 Use *${helpCmd}* to get details about a specific command, or *${menuCmd}* for all commands.` 
      }, { quoted: msg });
    }
  }
};
