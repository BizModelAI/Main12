import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key not configured' });
    return;
  }
  // Input validation
  const { prompt, messages, maxTokens = 1200, max_tokens, temperature = 0.7, responseFormat = null, systemMessage } = req.body;

  // Validate prompt size
  if (prompt && typeof prompt === 'string' && prompt.length > 10000) {
    res.status(400).json({ error: 'Prompt too long (max 10,000 characters)' });
    return;
  }

  // Validate messages array
  if (messages && (!Array.isArray(messages) || messages.length > 50)) {
    res.status(400).json({ error: 'Invalid messages format or too many messages (max 50)' });
    return;
  }

  // Validate temperature
  if (temperature < 0 || temperature > 2) {
    res.status(400).json({ error: 'Temperature must be between 0 and 2' });
    return;
  }
  let openaiMessages = [];
  if (messages && Array.isArray(messages)) {
    openaiMessages = messages;
  } else if (prompt) {
    if (systemMessage) {
      openaiMessages.push({ role: 'system', content: systemMessage });
    }
    openaiMessages.push({ role: 'user', content: prompt });
  } else {
    res.status(400).json({ error: 'Missing prompt or messages' });
    return;
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        temperature,
        max_tokens: maxTokens || max_tokens || 1200,
        response_format: responseFormat,
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data.content || data.message || data.response;
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI request failed', details: error instanceof Error ? error.message : String(error) });
  }
}
