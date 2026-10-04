import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';

const execPromise = util.promisify(exec);

export async function checkFfmpeg() {
  try {
    await execPromise('ffmpeg -version');
    return true;
  } catch (err) {
    console.warn('[ALSON-XMD Media] WARNING: ffmpeg is not installed or not in PATH. Sticker, tomp3, and toimg conversions may fail.');
    return false;
  }
}

export async function convertToMp3(inputPath, outputPath) {
  try {
    await execPromise(`ffmpeg -i "${inputPath}" -vn -ab 128k -ar 44100 -y "${outputPath}"`);
    return outputPath;
  } catch (err) {
    throw new Error(`FFmpeg audio conversion failed: ${err.message}`);
  }
}

export async function convertToSticker(inputPath, outputPath) {
  try {
    await execPromise(`ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -y "${outputPath}"`);
    return outputPath;
  } catch (err) {
    throw new Error(`FFmpeg sticker conversion failed: ${err.message}`);
  }
}

export async function convertToImage(inputPath, outputPath) {
  try {
    await execPromise(`ffmpeg -i "${inputPath}" -y "${outputPath}"`);
    return outputPath;
  } catch (err) {
    throw new Error(`FFmpeg image conversion failed: ${err.message}`);
  }
}
