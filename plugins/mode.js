import { botMode } from '../lib/botMode.js';

export default {
  name: ['mode'],
  description: 'Manage bot operating mode (public or private) (Owner Only)',
  category: 'Owner',
  usage: 'mode <public|private|status>',
  ownerOnly: true,
  async execute({ sock, msg, args, config }) {
    const subAction = args[0]?.toLowerCase();

    if (!subAction || !['public', 'private', 'status'].includes(subAction)) {
      const p = config.prefix;
      const currentMode = botMode.getMode();
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `⚙️ *${config.pairingBrand} Mode Manager*\n\n` +
              `Current Mode: *${currentMode.toUpperCase()}*\n\n` +
              `Usage:\n` +
              `• *${p}mode public* - Set bot to public mode\n` +
              `• *${p}mode private* - Set bot to private mode (owners only)\n` +
              `• *${p}mode status* - Show current mode` 
      }, { quoted: msg });
      return;
    }

    if (subAction === 'public') {
      botMode.setMode('public');
      await sock.sendMessage(msg.key.remoteJid, { text: `🟢 Bot operating mode set to *PUBLIC*.` }, { quoted: msg });
    } else if (subAction === 'private') {
      botMode.setMode('private');
      await sock.sendMessage(msg.key.remoteJid, { text: `🔒 Bot operating mode set to *PRIVATE* (Owner commands only).` }, { quoted: msg });
    } else if (subAction === 'status') {
      const currentMode = botMode.getMode();
      await sock.sendMessage(msg.key.remoteJid, { text: `⚙️ Current bot mode is: *${currentMode.toUpperCase()}*` }, { quoted: msg });
    }
  }
};
