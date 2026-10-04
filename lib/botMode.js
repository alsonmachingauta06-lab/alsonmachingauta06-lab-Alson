import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'data', 'bot-config.json');

let botConfig = {
  mode: 'public'
};

function loadBotConfig() {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed.mode && ['public', 'private'].includes(parsed.mode.toLowerCase())) {
        botConfig.mode = parsed.mode.toLowerCase();
      }
    }
  } catch (err) {
    console.error('[BotMode] Failed to load bot config:', err);
  }
}

function saveBotConfig() {
  try {
    const dir = path.dirname(configFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configFilePath, JSON.stringify(botConfig, null, 2));
  } catch (err) {
    console.error('[BotMode] Failed to save bot config:', err);
  }
}

loadBotConfig();

export const botMode = {
  getMode() {
    return botConfig.mode;
  },
  setMode(mode) {
    const lower = mode?.toLowerCase();
    if (['public', 'private'].includes(lower)) {
      botConfig.mode = lower;
      saveBotConfig();
      return true;
    }
    return false;
  },
  isPrivate() {
    return botConfig.mode === 'private';
  },
  isPublic() {
    return botConfig.mode === 'public';
  }
};
