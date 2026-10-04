import fs from 'fs';
import path from 'path';

const stateFilePath = path.join(process.cwd(), 'session', 'antiedit_state.json');

let antiEditState = {
  enabled: false
};

const messageCache = new Map(); // key.id -> { text, remoteJid, participant, pushName }

function loadAntiEditState() {
  try {
    if (fs.existsSync(stateFilePath)) {
      const data = fs.readFileSync(stateFilePath, 'utf8');
      antiEditState = { ...antiEditState, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('[AntiEdit] Failed to load state:', err);
  }
}

function saveAntiEditState() {
  try {
    const dir = path.dirname(stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(stateFilePath, JSON.stringify(antiEditState, null, 2));
  } catch (err) {
    console.error('[AntiEdit] Failed to save state:', err);
  }
}

loadAntiEditState();

export const antiEditManager = {
  isEnabled() {
    return antiEditState.enabled;
  },
  setEnabled(status) {
    antiEditState.enabled = !!status;
    saveAntiEditState();
    return antiEditState.enabled;
  },
  cacheMessage(msg) {
    if (!msg || !msg.key || !msg.key.id) return;
    const body = 
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      '';
    if (body) {
      messageCache.set(msg.key.id, {
        text: body,
        remoteJid: msg.key.remoteJid,
        participant: msg.key.participant || msg.key.remoteJid,
        pushName: msg.pushName || 'User'
      });
      if (messageCache.size > 1000) {
        const firstKey = messageCache.keys().next().value;
        messageCache.delete(firstKey);
      }
    }
  },
  getCachedMessage(id) {
    return messageCache.get(id);
  }
};
