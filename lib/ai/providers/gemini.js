import { GoogleGenAI } from '@google/genai';

export async function generateAIResponse({ prompt, systemInstruction, apiKey, model }) {
  if (!apiKey) {
    throw new Error('AI API Key is not configured.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const selectedModel = model || 'gemini-3.8-flash';

  const response = await ai.models.generateContent({
    model: selectedModel,
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || 'You are ALSON-XMD, a helpful WhatsApp AI assistant.'
    }
  });

  return response.text || 'No response generated.';
}
