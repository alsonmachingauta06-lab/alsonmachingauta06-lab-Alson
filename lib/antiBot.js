import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

const stateFilePath = path.join(process.cwd(), 'session', 'antibot_state.json');

let antiBotState = {
  enabled: false,
  action: 'kick', // 'kick' or 'warn'
  whitelist: []
};

function loadAntiBotState() {
  try {
    if (fs.existsSync(stateFilePath)) {
      const data = fs.readFileSync(stateFilePath, 'utf8');
      antiBotState = { ...antiBotState, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('[AntiBot] Failed to load state:', err);
  }
}

function saveAntiBotState() {
  try {
    const dir = path.dirname(stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(stateFilePath, JSON.stringify(antiBotState, null, 2));
  } catch (err) {
    console.error('[AntiBot] Failed to save state:', err);
  }
}

loadAntiBotState();

// Flag for intentional logout/unpair
export let isIntentionalLogout = false;

export const antiBotManager = {
  getStatus() {
    return antiBotState;
  },
  setEnabled(status) {
    antiBotState.enabled = !!status;
    saveAntiBotState();
    return antiBotState.enabled;
  },
  setAction(action) {
    if (['kick', 'warn'].includes(action)) {
      antiBotState.action = action;
      saveAntiBotState();
      return true;
    }
    return false;
  },
  async triggerUnpair(sock) {
    try {
      console.log('[AntiBot] Triggering self-unpair / session teardown...');
      isIntentionalLogout = true;

      if (sock) {
        try {
          await sock.logout();
        } catch (err) {
          console.error('[AntiBot] Socket logout error (ignoring):', err);
        }
      }

      // Safely remove local session directory
      if (fs.existsSync(config.sessionDir)) {
        fs.rmSync(config.sessionDir, { recursive: true, force: true });
        console.log('[AntiBot] Local session directory cleared successfully.');
      }

      return { success: true, message: 'Bot successfully unpaired, logged out, and session cleared.' };
    } catch (err) {
      console.error('[AntiBot] Failed to trigger unpair:', err);
      return { success: false, error: err.message };
    }
  }
};
