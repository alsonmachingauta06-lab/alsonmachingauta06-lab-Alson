import fs from 'fs';
import path from 'path';

const stateFilePath = path.join(process.cwd(), 'session', 'anticall_state.json');

let antiCallState = {
  enabled: false
};

function loadAntiCallState() {
  try {
    if (fs.existsSync(stateFilePath)) {
      const data = fs.readFileSync(stateFilePath, 'utf8');
      antiCallState = { ...antiCallState, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('[AntiCall] Failed to load state:', err);
  }
}

function saveAntiCallState() {
  try {
    const dir = path.dirname(stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(stateFilePath, JSON.stringify(antiCallState, null, 2));
  } catch (err) {
    console.error('[AntiCall] Failed to save state:', err);
  }
}

loadAntiCallState();

export const antiCallManager = {
  isEnabled() {
    return antiCallState.enabled;
  },
  setEnabled(status) {
    antiCallState.enabled = !!status;
    saveAntiCallState();
    return antiCallState.enabled;
  }
};
