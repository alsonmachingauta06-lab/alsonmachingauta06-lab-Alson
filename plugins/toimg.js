import fs from 'fs';
import path from 'path';
import os from 'os';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { convertToImage } from '../lib/media/converter.js';

export default {
  name: ['toimg', 'image'],
  description: 'Converts a sticker into an image',
  category: 'Media',
  usage: 'toimg (reply to sticker)',
  ownerOnly: false,
  async execute({ sock, msg, config }) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const mediaMsg = quoted?.stickerMessage;

      if (!mediaMsg) {
        await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Please reply to a sticker with *${config.prefix || ''}toimg*.` }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `⏳ Converting sticker to image...` }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { key: msg.key, message: quoted },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const tempDir = os.tmpdir();
      const inputPath = path.join(tempDir, `input_${Date.now()}.webp`);
      const outputPath = path.join(tempDir, `image_${Date.now()}.png`);

      fs.writeFileSync(inputPath, buffer);
      await convertToImage(inputPath, outputPath);

      const imageBuffer = fs.readFileSync(outputPath);

      await sock.sendMessage(msg.key.remoteJid, { image: imageBuffer, caption: `🖼️ *${config.pairingBrand} Converted Image*` }, { quoted: msg });

      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (e) {}

    } catch (err) {
      console.error('[ToImg Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to convert sticker to image: ${err.message}` }, { quoted: msg });
    }
  }
};
