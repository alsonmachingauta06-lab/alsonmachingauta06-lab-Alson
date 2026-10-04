export default {
  name: ['whois', 'userinfo'],
  description: 'Shows details about a user',
  category: 'Tools',
  usage: 'whois (reply or tag user)',
  async execute({ sock, msg, config }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo;
    const targetJid = quoted?.participant || msg.key.participant || msg.key.remoteJid;
    const number = targetJid ? targetJid.replace(/[^0-9]/g, '') : 'Unknown';
    const isOwner = config.ownerNumbers.includes(number);

    let ppUrl;
    try {
      ppUrl = await sock.profilePictureUrl(targetJid, 'image');
    } catch (e) {
      ppUrl = null;
    }

    const text = `👤 *User Information*\n\n` +
                 `▫️ Number: +${number}\n` +
                 `▫️ JID: ${targetJid}\n` +
                 `▫️ Verified Owner: ${isOwner ? 'Yes 🛡️ (Blue Badge)' : 'No'}`;

    if (ppUrl) {
      await sock.sendMessage(msg.key.remoteJid, { image: { url: ppUrl }, caption: text }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    }
  }
};
