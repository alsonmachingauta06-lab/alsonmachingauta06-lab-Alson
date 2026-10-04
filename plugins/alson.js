export default {
  name: ['alson'],
  description: 'Cyber/Hacker command suite powered by ALSON-XMD',
  category: 'Hacker',
  usage: 'alson [hack|matrix|ip|system|status]',
  async execute({ sock, msg, args, config }) {
    const remoteJid = msg.key.remoteJid;
    const subCommand = args[0]?.toLowerCase() || 'main';
    let replyText = '';

    switch (subCommand) {
      case 'hack':
        const target = args.slice(1).join(' ') || 'Target System';
        replyText = `💻 *ALSON-XMD Cyber Operations*\n\n` +
          `[+] Initializing secure backdoor into *${target}*...\n` +
          `[+] Bypassing firewall protocols...\n` +
          `[+] Access granted! 🟢 Root privileges acquired.\n` +
          `🔒 Secure data extracted successfully.`;
        break;

      case 'matrix':
        replyText = `🟢 *ALSON-XMD Matrix Code Stream*\n\n` +
          `01000001 01001100 01010011 01001111 01001110\n` +
          `01011000 01001101 01000100 00100000 01010011 01011001 01010011 01010100 01000101 01001101\n\n` +
          `*System status: SECURE & ONLINE.*`;
        break;

      case 'ip':
        const ipTarget = args[1] || '127.0.0.1';
        replyText = `🌐 *Network Trace Utility*\n\n` +
          `Target: \`${ipTarget}\`\n` +
          `Status: Online\n` +
          `Geo-Location: Cyber Grid, Alson Server\n` +
          `Latency: 12ms\n` +
          `Security Rating: 🛡️ Protected by ALSON-XMD`;
        break;

      case 'system':
        replyText = `🖥️ *ALSON-XMD Core Diagnostics*\n\n` +
          `Bot Name: *${config.botName}*\n` +
          `Prefix: \`${config.rawPrefix}\`\n` +
          `AI Engine: ${config.aiProvider.toUpperCase()} (${config.aiModel})\n` +
          `Owners: ${config.ownerNumbers.join(', ')}\n` +
          `Channel: Official Alson XMD Network`;
        break;

      default:
        replyText = `⚡ *ALSON-XMD Cyber Protocol (Alson)*\n\n` +
          `Welcome to the Alson hacker command suite.\n\n` +
          `Available subcommands:\n` +
          `• \`${config.prefix}alson hack <target>\`\n` +
          `• \`${config.prefix}alson matrix\`\n` +
          `• \`${config.prefix}alson ip <address>\`\n` +
          `• \`${config.prefix}alson system\``;
        break;
    }

    await sock.sendMessage(remoteJid, { text: replyText }, { quoted: msg });
  }
};
