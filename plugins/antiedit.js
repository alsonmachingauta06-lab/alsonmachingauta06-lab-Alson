import { antiEditManager } from '../lib/antiEdit.js';

export default {
  name: ['antiedit'],
  description: 'Manage anti-edit protection (detect and restore edited WhatsApp messages)',
  category: 'Owner',
  ownerOnly: true,
  usage: 'antiedit <on|off|status>',
  async execute({ sock, msg, args, config }) {
    const remoteJid = msg.key.remoteJid;
    const action = args[0]?.toLowerCase();

    if (action === 'on') {
      antiEditManager.setEnabled(true);
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Edit Protection Enabled*\n\nAlson-XMD will now detect and expose edited messages.` }, { quoted: msg });
    } else if (action === 'off') {
      antiEditManager.setEnabled(false);
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Edit Protection Disabled*\n\nEdited messages will no longer be intercepted.` }, { quoted: msg });
    } else if (action === 'status') {
      const status = antiEditManager.isEnabled();
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Edit Status*\n\nStatus: *${status ? 'ENABLED 🟢' : 'DISABLED 🔴'}*` }, { quoted: msg });
    } else {
      await sock.sendMessage(remoteJid, { text: `🛡️ *Anti-Edit Manager*\n\nUsage:\n• \`${config.prefix}antiedit on\`\n• \`${config.prefix}antiedit off\`\n• \`${config.prefix}antiedit status\`` }, { quoted: msg });
    }
  }
};
