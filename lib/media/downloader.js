import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: statusCode ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => reject(err));
    });
  });
}
