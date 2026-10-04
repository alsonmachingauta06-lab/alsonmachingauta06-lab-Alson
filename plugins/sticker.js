import fs from 'fs';
import path from 'path';
import os from 'os';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { convertToSticker } from '../lib/media/converter.js';

export default {
  name: ['sticker', 's'],
  description: 'Converts an image or video into a WhatsApp sticker',
  category: 'Media',
  usage: 'sticker (reply to image/video)',
  ownerOnly: false,
  async execute({ sock, msg, config }) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || msg.message;
      const mediaMsg = quoted?.imageMessage || quoted?.videoMessage;

      if (!mediaMsg) {
        await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Please reply to an image or video with *${config.prefix || ''}sticker*.` }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `⏳ Generating sticker...` }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { key: msg.key, message: quoted },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const tempDir = os.tmpdir();
      const inputPath = path.join(tempDir, `input_${Date.now()}.tmp`);
      const outputPath = path.join(tempDir, `sticker_${Date.now()}.webp`);

      fs.writeFileSync(inputPath, buffer);
      await convertToSticker(inputPath, outputPath);

      const stickerBuffer = fs.readFileSync(outputPath);

      await sock.sendMessage(msg.key.remoteJid, { sticker: stickerBuffer }, { quoted: msg });

      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (e) {}

    } catch (err) {
      console.error('[Sticker Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to create sticker: ${err.message}` }, { quoted: msg });
    }
  }
};
