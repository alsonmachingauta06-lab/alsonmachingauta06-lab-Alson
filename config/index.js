import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const rawOwners = process.env.OWNER_NUMBERS || '263786359833,263783549857';
const ownerNumbers = rawOwners.split(',').map(num => num.trim().replace(/[^0-9]/g, '')).filter(Boolean);

const rawPrefix = process.env.PREFIX || '.';
const prefix = rawPrefix.toLowerCase() === 'none' ? '' : rawPrefix;

const defaultSystemPrompt = 
  `- Identify the bot as ALSON-XMD.\n` +
  `- Be helpful, intelligent, concise, and technically accurate.\n` +
  `- Understand that the bot is a WhatsApp assistant.\n` +
  `- Assist with programming, Linux/Termux, Node.js, JavaScript, WhatsApp-bot development, troubleshooting, and general questions.\n` +
  `- Do not reveal API keys, environment variables, authentication credentials, or WhatsApp session information.\n` +
  `- Do not pretend to have capabilities that the configured AI provider does not actually provide.\n` +
  `- Keep responses suitable for WhatsApp formatting.`;

export const config = {
  botName: process.env.BOT_NAME || 'ALSON-XMD',
  prefix,
  rawPrefix,
  ownerNumbers,
  pairingNumber: process.env.PAIRING_NUMBER || '263783549857',
  pairingBrand: process.env.PAIRING_BRAND || 'ALSON-XMD',
  newsletterJid: process.env.NEWSLETTER_JID || '120363411442434414@newsletter',
  groupLink: process.env.GROUP_LINK || 'https://chat.whatsapp.com/LQMrievFuQW6GyqDRxuvRu',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'openai',
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
  aiApiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '',
  chatbotEnabled: process.env.CHATBOT_ENABLED === 'true',
  chatbotGroups: process.env.CHATBOT_GROUPS === 'true',
  chatbotPrivate: process.env.CHATBOT_PRIVATE === 'true',
  aiSystemPrompt: process.env.AI_SYSTEM_PROMPT || defaultSystemPrompt,
  sessionDir: path.join(process.cwd(), 'session'),
  pluginsDir: path.join(process.cwd(), 'plugins')
};
