import { downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Publishes quoted/replied-to message content as a WhatsApp Status broadcast.
 * 
 * @param {import('@whiskeysockets/baileys').WASocket} sock - WhatsApp socket instance
 * @param {object} quoted - Quoted message object
 * @param {object} originalMsg - Original message object
 * @returns {Promise<{success: boolean, error?: string, type?: string}>}
 */
export async function publishStatus(sock, quoted, originalMsg) {
  if (!quoted) {
    return { success: false, error: 'No quoted message found to publish as Status.' };
  }

  const broadcastJid = 'status@broadcast';

  try {
    // 1. Check for text message
    const textContent = quoted.conversation || quoted.extendedTextMessage?.text;
    if (textContent) {
      await sock.sendMessage(broadcastJid, { text: textContent });
      return { success: true, type: 'text' };
    }

    // 2. Check for media message (image, video, audio, document)
    const mediaMsg = quoted.imageMessage || quoted.videoMessage || quoted.audioMessage || quoted.documentMessage;
    if (mediaMsg) {
      const buffer = await downloadMediaMessage(
        { key: { id: originalMsg.key.id, remoteJid: originalMsg.key.remoteJid }, message: quoted },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      if (!buffer) {
        return { success: false, error: 'Failed to download media content from quoted message.' };
      }

      const caption = mediaMsg.caption || '';

      if (quoted.imageMessage) {
        await sock.sendMessage(broadcastJid, { image: buffer, caption });
        return { success: true, type: 'image' };
      } else if (quoted.videoMessage) {
        await sock.sendMessage(broadcastJid, { video: buffer, caption });
        return { success: true, type: 'video' };
      } else if (quoted.audioMessage) {
        await sock.sendMessage(broadcastJid, { audio: buffer, mimetype: mediaMsg.mimetype || 'audio/mp4', ptt: mediaMsg.ptt || false });
        return { success: true, type: 'audio' };
      } else if (quoted.documentMessage) {
        await sock.sendMessage(broadcastJid, { document: buffer, mimetype: mediaMsg.documentMessage?.mimetype || 'application/octet-stream', fileName: mediaMsg.documentMessage?.fileName || 'media' });
        return { success: true, type: 'document' };
      }
    }

    return { success: false, error: 'The replied message type is not supported for publishing as Status.' };

  } catch (err) {
    console.error('[ALSON-XMD Status Error]:', err);
    return { success: false, error: err.message || 'Failed to upload and publish Status.' };
  }
}
