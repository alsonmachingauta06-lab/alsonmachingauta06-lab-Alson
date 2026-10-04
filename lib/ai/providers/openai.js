export async function generateAIResponse({ prompt, systemInstruction, apiKey, model }) {
  if (!apiKey) {
    throw new Error('OpenAI API Key is not configured. Please set OPENAI_API_KEY.');
  }

  const selectedModel = model || 'gpt-4o-mini';
  const systemPrompt = systemInstruction || 'You are ALSON-XMD, a helpful WhatsApp AI assistant.';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    return reply || 'No response generated from OpenAI.';
  } catch (error) {
    console.error('[OpenAI Error]:', error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}
