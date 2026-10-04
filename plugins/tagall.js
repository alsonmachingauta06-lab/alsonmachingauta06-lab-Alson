export default {
  name: ['tagall', 'everyone'],
  description: 'Tags all members in a WhatsApp group (Owner / Admin Only)',
  category: 'Group',
  usage: 'tagall [message]',
  ownerOnly: true,
  async execute({ sock, msg, text }) {
    const jid = msg.key.remoteJid;
    if (!jid.endsWith('@g.us')) {
      await sock.sendMessage(jid, { text: `❌ This command can only be used in groups.` }, { quoted: msg });
      return;
    }

    try {
      const metadata = await sock.groupMetadata(jid);
      const participants = metadata.participants;

      let messageText = `📢 *Group Tag All*\n`;
      if (text) messageText += `Message: ${text}\n\n`;
      else messageText += `\n`;

      const mentions = [];
      for (const p of participants) {
        messageText += `@${p.id.split('@')[0]} `;
        mentions.push(p.id);
      }

      await sock.sendMessage(jid, { text: messageText, mentions }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(jid, { text: `❌ Failed to tag members: ${err.message}` }, { quoted: msg });
    }
  }
};
