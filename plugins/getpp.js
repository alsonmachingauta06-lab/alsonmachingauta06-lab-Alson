export default {
  name: ['getpp', 'profilepic', 'pp'],
  description: 'Gets the profile picture of a user (Owner / Admin Only)',
  category: 'Owner',
  usage: 'getpp [phone_number or reply]',
  ownerOnly: true,
  async execute({ sock, msg, args, text, isOwner, config }) {
    try {
      let targetJid = '';

      // Check if replying to someone
      const quotedMessage = msg.message?.extendedTextMessage?.contextInfo;
      if (quotedMessage && quotedMessage.participant) {
        targetJid = quotedMessage.participant;
      } else if (text) {
        // Clean phone number argument
        const cleanedNumber = text.replace(/[^0-9]/g, '');
        if (cleanedNumber.length >= 7) {
          targetJid = `${cleanedNumber}@s.whatsapp.net`;
        }
      }

      if (!targetJid) {
        // Default to sender if no target provided
        targetJid = msg.key.participant || msg.key.remoteJid;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `⏳ Fetching profile picture for ${targetJid.split('@')[0]}...` }, { quoted: msg });

      let ppUrl;
      try {
        ppUrl = await sock.profilePictureUrl(targetJid, 'image');
      } catch (err) {
        // Fallback to high-res or failure
        ppUrl = null;
      }

      if (!ppUrl) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Could not retrieve profile picture. The user may have privacy settings enabled or no profile picture.` 
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, { 
        image: { url: ppUrl }, 
        caption: `🖼️ *${config.pairingBrand} Profile Picture*\nTarget: +${targetJid.split('@')[0]}` 
      }, { quoted: msg });

    } catch (err) {
      console.error('[GetPP Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ Failed to retrieve profile picture. WhatsApp privacy restrictions may apply.` 
      }, { quoted: msg });
    }
  }
};
