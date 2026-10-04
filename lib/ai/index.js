import { generateAIResponse as openaiGenerate } from './providers/openai.js';
import { generateAIResponse as geminiGenerate } from './providers/gemini.js';
import { config } from '../../config/index.js';

export async function askAI(prompt, customSystemPrompt) {
  const provider = (config.aiProvider || 'openai').toLowerCase();
  const apiKey = config.aiApiKey || config.openaiApiKey || config.geminiApiKey;
  const model = config.aiModel || 'gpt-4o-mini';
  const systemInstruction = customSystemPrompt || config.aiSystemPrompt;

  try {
    if (provider === 'openai' || provider === 'gpt') {
      return await openaiGenerate({
        prompt,
        systemInstruction,
        apiKey,
        model
      });
    }

    if (provider === 'gemini' || provider === 'google') {
      return await geminiGenerate({
        prompt,
        systemInstruction,
        apiKey: config.geminiApiKey || apiKey,
        model: config.aiModel || 'gemini-3.8-flash'
      });
    }

    // Default fallback to OpenAI if provider not recognized
    return await openaiGenerate({
      prompt,
      systemInstruction,
      apiKey,
      model
    });
  } catch (error) {
    console.error('[askAI Error]:', error);
    return `❌ AI Error: ${error.message}`;
  }
}
