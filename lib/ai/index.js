import { generateAIResponse as geminiGenerate } from './providers/gemini.js';
import { config } from '../../config/index.js';

export async function askAI(prompt, customSystemPrompt) {
  const provider = (config.aiProvider || 'gemini').toLowerCase();
  const apiKey = config.aiApiKey || config.geminiApiKey;
  const model = config.aiModel || 'gemini-3.8-flash';
  const systemInstruction = customSystemPrompt || config.aiSystemPrompt;

  if (provider === 'gemini' || provider === 'google') {
    return await geminiGenerate({
      prompt,
      systemInstruction,
      apiKey,
      model
    });
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}
