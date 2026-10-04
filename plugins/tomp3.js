import fs from 'fs';
import path from 'path';
import os from 'os';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { convertToMp3 } from '../lib/media/converter.js';

export default {
  name: ['tomp3', 'mp3', 'toaudio'],
  description: 'Converts a video or voice note into an MP3 audio file',
  category: 'Media',
  usage: 'tomp3 (reply to video/audio)',
  ownerOnly: false,
  async execute({ sock, msg, config }) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const mediaMsg = quoted?.videoMessage || quoted?.audioMessage;

      if (!mediaMsg) {
        await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Please reply to a video or audio note with *${config.prefix || ''}tomp3*.` }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `⏳ Converting media to MP3...` }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { key: msg.key, message: quoted },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const tempDir = os.tmpdir();
      const inputPath = path.join(tempDir, `input_${Date.now()}.tmp`);
      const outputPath = path.join(tempDir, `audio_${Date.now()}.mp3`);

      fs.writeFileSync(inputPath, buffer);
      await convertToMp3(inputPath, outputPath);

      const mp3Buffer = fs.readFileSync(outputPath);

      await sock.sendMessage(msg.key.remoteJid, { audio: mp3Buffer, mimetype: 'audio/mp4', ptt: false }, { quoted: msg });

      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (e) {}

    } catch (err) {
      console.error('[ToMp3 Plugin Error]:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to convert media to MP3: ${err.message}` }, { quoted: msg });
    }
  }
};
