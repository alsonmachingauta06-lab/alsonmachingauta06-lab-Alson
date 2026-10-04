export default {
  name: ['ping'],
  description: 'Checks bot latency and responsiveness',
  category: 'General',
  usage: 'ping',
  async execute({ sock, msg }) {
    const start = Date.now();
    const sent = await sock.sendMessage(msg.key.remoteJid, { text: 'Pong! 🏓' }, { quoted: msg });
    const latency = Date.now() - start;
    await sock.sendMessage(msg.key.remoteJid, { text: `Pong! Response speed: *${latency}ms*` }, { quoted: sent });
  }
};
