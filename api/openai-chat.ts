import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCORSHeaders } from './_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always return JSON, never HTML
  res.setHeader('Content-Type', 'application/json');
  setCORSHeaders(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Validate OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('🔑 Checking OpenAI API key:', apiKey ? 'Present' : 'Missing');
    if (!apiKey) {
      console.error('❌ OpenAI API key not configured');
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

    // Build OpenAI messages
    let openaiMessages = [];
    
    if (messages && Array.isArray(messages)) {
      openaiMessages = messages;
    } else if (prompt) {
      if (systemMessage) {
        openaiMessages.push({ role: 'system', content: systemMessage });
      }
      openaiMessages.push({ role: 'user', content: prompt });
    } else {
      res.status(400).json({ error: 'Either prompt or messages is required' });
      return;
    }

    // Call OpenAI API
    console.log('🤖 Making OpenAI API call with messages count:', openaiMessages.length);
    console.log('🎛️ Request parameters:', { maxTokens: finalMaxTokens, temperature });

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: openaiMessages,
        max_tokens: max_tokens || maxTokens,
        temperature: temperature,
        response_format: responseFormat,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorData);
      res.status(openaiResponse.status).json({ 
        error: 'OpenAI API error',
        details: process.env.NODE_ENV === 'development' ? errorData : undefined
      });
      return;
    }

    const data = await openaiResponse.json();
    
    // Extract content from response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('No content in OpenAI response:', data);
      res.status(500).json({ error: 'No content generated' });
      return;
    }

    res.status(200).json({
      success: true,
      content: content,
      usage: data.usage,
      model: data.model
    });

  } catch (error) {
    console.error('OpenAI chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process OpenAI request',
      details: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : String(error)
        : undefined
    });
  }
}
