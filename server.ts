import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { config } from './config/index.js';
import { loadPlugins } from './lib/pluginLoader.js';
import { activeSock, connectionStatus, pairingCodeGenerated, latestQR, startWhatsAppBot } from './lib/connection.js';

interface LogItem {
  time: string;
  type: 'info' | 'error';
  message: string;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // In-memory log buffer
  const botLogs: LogItem[] = [];
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args: unknown[]) => {
    const line = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    botLogs.push({ time: new Date().toLocaleTimeString(), type: 'info', message: line });
    if (botLogs.length > 200) botLogs.shift();
    originalLog(...args);
  };

  console.error = (...args: unknown[]) => {
    const line = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    botLogs.push({ time: new Date().toLocaleTimeString(), type: 'error', message: line });
    if (botLogs.length > 200) botLogs.shift();
    originalError(...args);
  };

  // API Routes
  app.get('/api/status', async (req, res) => {
    try {
      const { pluginInfo } = await loadPlugins(config.pluginsDir);
      let sessionExists = false;
      try {
        if (fs.existsSync(config.sessionDir)) {
          sessionExists = fs.readdirSync(config.sessionDir).length > 0;
        }
      } catch (e) {
        sessionExists = false;
      }

      res.json({
        botName: config.botName,
        prefix: config.rawPrefix,
        ownerNumbers: config.ownerNumbers.join(', '),
        pairingNumber: config.pairingNumber,
        pairingBrand: config.pairingBrand,
        aiProvider: config.aiProvider,
        aiModel: config.aiModel,
        chatbotEnabled: config.chatbotEnabled,
        chatbotGroups: config.chatbotGroups,
        chatbotPrivate: config.chatbotPrivate,
        hasGeminiKey: !!(config.geminiApiKey || config.aiApiKey),
        connectionStatus,
        pairingCode: pairingCodeGenerated,
        qrCode: latestQR,
        plugins: pluginInfo,
        sessionExists
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, connectionStatus: 'error' });
    }
  });

  app.get('/api/logs', (req, res) => {
    try {
      res.json({ logs: botLogs });
    } catch (err: any) {
      res.status(500).json({ logs: [], error: err.message });
    }
  });

  app.post('/api/config', (req, res) => {
    try {
      const { 
        botName, 
        prefix, 
        ownerNumbers, 
        pairingNumber, 
        pairingBrand, 
        geminiApiKey,
        aiProvider,
        aiModel,
        aiApiKey,
        chatbotEnabled,
        chatbotGroups,
        chatbotPrivate,
        aiSystemPrompt
      } = req.body;

      if (botName) config.botName = botName;
      if (prefix !== undefined) {
        config.rawPrefix = prefix;
        config.prefix = prefix.toLowerCase() === 'none' ? '' : prefix;
      }
      if (ownerNumbers !== undefined) {
        config.ownerNumbers = ownerNumbers.split(',').map((n: string) => n.trim().replace(/[^0-9]/g, '')).filter(Boolean);
      }
      if (pairingNumber !== undefined) config.pairingNumber = pairingNumber;
      if (pairingBrand !== undefined) config.pairingBrand = pairingBrand;
      if (geminiApiKey !== undefined) {
        config.geminiApiKey = geminiApiKey;
        if (!config.aiApiKey) config.aiApiKey = geminiApiKey;
      }
      if (aiProvider !== undefined) config.aiProvider = aiProvider;
      if (aiModel !== undefined) config.aiModel = aiModel;
      if (aiApiKey !== undefined) config.aiApiKey = aiApiKey;
      if (chatbotEnabled !== undefined) config.chatbotEnabled = !!chatbotEnabled;
      if (chatbotGroups !== undefined) config.chatbotGroups = !!chatbotGroups;
      if (chatbotPrivate !== undefined) config.chatbotPrivate = !!chatbotPrivate;
      if (aiSystemPrompt !== undefined) config.aiSystemPrompt = aiSystemPrompt;

      res.json({ success: true, message: 'Configuration updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/start-bot', async (req, res) => {
    try {
      console.log('[Dashboard] Starting WhatsApp bot connection...');
      startWhatsAppBot().catch((err: any) => console.error('[Bot Start Error]:', err));
      res.json({ success: true, message: 'WhatsApp bot connection sequence initiated' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/test-command', async (req, res) => {
    try {
      const { command, senderNumber } = req.body;
      const { commands } = await loadPlugins(config.pluginsDir);
      const cmdName = command.replace(config.prefix, '').trim().toLowerCase();
      const cmd = commands.get(cmdName);

      if (!cmd) {
        return res.json({ success: false, response: `❌ Command .${cmdName} not found.` });
      }

      // Simulate execution output
      let simulatedOutput = '';
      const mockSock = {
        async sendMessage(jid: string, content: any) {
          simulatedOutput += (content.text || JSON.stringify(content)) + '\n';
          return { key: { id: 'mock_msg_id' } };
        }
      };

      await cmd.execute({
        sock: mockSock,
        msg: { key: { remoteJid: 'mock_chat@s.whatsapp.net', fromMe: false } },
        args: [],
        text: '',
        senderJid: 'mock_user@s.whatsapp.net',
        senderNumber: senderNumber || config.ownerNumbers[0] || '263783549857',
        isOwner: true,
        config,
        commands
      });
      res.json({ success: true, response: simulatedOutput.trim() || 'Command executed successfully.' });
    } catch (err: any) {
      res.json({ success: false, response: `❌ Error executing command: ${err.message}` });
    }
  });

  // Setup Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] ALSON-XMD Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
