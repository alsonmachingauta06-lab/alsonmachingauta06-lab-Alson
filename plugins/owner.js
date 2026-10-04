export default {
  name: ['owner', 'creator'],
  description: 'Shows bot owner contact information',
  category: 'General',
  usage: 'owner',
  async execute({ sock, msg, config }) {
    const owners = config.ownerNumbers.map(n => `+${n}`).join(' & ');
    const text = `👑 *${config.pairingBrand} Bot Owners*\n\n` +
                 `Primary Owners: ${owners}\n` +
                 `Status: Verified 🛡️`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
};
