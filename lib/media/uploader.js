import fs from 'fs';

export async function prepareMediaBuffer(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Media file not found at ${filePath}`);
  }
  return fs.readFileSync(filePath);
}
