import { antiBotManager } from '../lib/antiBot.js';

export default {
  name: ['antibot', 'antispam', 'unpair'],
  description: 'Manage Anti-Bot protection and self-unpair safety trigger (Owner Only)',
  category: 'Owner',
  usage: 'antibot <on|off|status|unpair>',
  ownerOnly: true,
  async execute({ sock, msg, args, config }) {
    const action = args[0]?.toLowerCase();

    if (!action || !['on', 'off', 'status', 'unpair'].includes(action)) {
      const p = config.prefix;
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `🛡️ *${config.pairingBrand} Anti-Bot & Unpair Manager*\n\n` +
              `Usage:\n` +
              `• *${p}antibot on* - Enable anti-bot protection\n` +
              `• *${p}antibot off* - Disable anti-bot protection\n` +
              `• *${p}antibot status* - Check current status\n` +
              `• *${p}antibot unpair* - Safely log out bot and clear session` 
      }, { quoted: msg });
      return;
    }

    if (action === 'on') {
      antiBotManager.setEnabled(true);
      await sock.sendMessage(msg.key.remoteJid, { text: `🛡️ Anti-Bot protection has been *ENABLED*.` }, { quoted: msg });
    } else if (action === 'off') {
      antiBotManager.setEnabled(false);
      await sock.sendMessage(msg.key.remoteJid, { text: `🛡️ Anti-Bot protection has been *DISABLED*.` }, { quoted: msg });
    } else if (action === 'status') {
      const state = antiBotManager.getStatus();
      const text = `🛡️ *${config.pairingBrand} Anti-Bot Status*\n\n` +
                   `▫️ Status: ${state.enabled ? '🟢 Enabled' : '🔴 Disabled'}\n` +
                   `▫️ Action: ${state.action.toUpperCase()}\n` +
                   `▫️ Mode: Group Participant Guard`;
      await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    } else if (action === 'unpair') {
      await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Initiating self-unpair and session cleanup...` }, { quoted: msg });
      const res = await antiBotManager.triggerUnpair(sock);
      if (res.success) {
        await sock.sendMessage(msg.key.remoteJid, { text: `✅ Bot successfully unpaired, logged out, and local session cleared.` }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Unpair error: ${res.error}` }, { quoted: msg });
      }
    }
  }
};
