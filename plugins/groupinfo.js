export default {
  name: ['groupinfo', 'ginfo'],
  description: 'Shows details about the current WhatsApp group',
  category: 'Group',
  usage: 'groupinfo',
  async execute({ sock, msg, config }) {
    const jid = msg.key.remoteJid;
    if (!jid.endsWith('@g.us')) {
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ This command can only be used inside WhatsApp groups.` }, { quoted: msg });
      return;
    }

    try {
      const metadata = await sock.groupMetadata(jid);
      const text = `👥 *Group Information*\n\n` +
                   `▫️ Name: ${metadata.subject}\n` +
                   `▫️ ID: ${metadata.id}\n` +
                   `▫️ Members: ${metadata.participants.length}\n` +
                   `▫️ Owner/Creator: @${metadata.owner?.split('@')[0] || 'Unknown'}`;

      await sock.sendMessage(msg.key.remoteJid, { text, mentions: metadata.owner ? [metadata.owner] : [] }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to fetch group metadata: ${err.message}` }, { quoted: msg });
    }
  }
};
