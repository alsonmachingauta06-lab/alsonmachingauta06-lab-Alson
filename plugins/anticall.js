import { antiCallManager } from '../lib/antiCall.js';

export default {
  name: ['anticall'],
  description: 'Manage anti-call protection (reject incoming WhatsApp calls automatically)',
  category: 'Owner',
  ownerOnly: true,
  usage: 'anticall <on|off|status>',
  async execute({ sock, msg, args, config }) {
    const remoteJid = msg.key.remoteJid;
    const action = args[0]?.toLowerCase();

    if (action === 'on') {
      antiCallManager.setEnabled(true);
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Call Protection Enabled*\n\nIncoming WhatsApp calls will now be automatically rejected.` }, { quoted: msg });
    } else if (action === 'off') {
      antiCallManager.setEnabled(false);
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Call Protection Disabled*\n\nIncoming WhatsApp calls will no longer be automatically rejected.` }, { quoted: msg });
    } else if (action === 'status') {
      const status = antiCallManager.isEnabled();
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Call Status*\n\nStatus: *${status ? 'ENABLED 🟢' : 'DISABLED 🔴'}*` }, { quoted: msg });
    } else {
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Call Manager*\n\nUsage:\n• \`${config.prefix}anticall on\`\n• \`${config.prefix}anticall off\`\n• \`${config.prefix}anticall status\`` }, { quoted: msg });
    }
  }
};
