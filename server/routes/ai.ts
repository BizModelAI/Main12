import express from 'express';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = (express as any).Router();
const prisma = new PrismaClient();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Validation schemas
const openaiChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string()
  })),
  maxTokens: z.number().optional(),
  temperature: z.number().optional()
});

const businessFitAnalysisSchema = z.object({
  quizData: z.any(),
  quizAttemptId: z.string()
});

// Income projections schema removed - no longer needed since we use hardcoded data

// Helper function to generate business fit analysis
async function generateBusinessFitAnalysis(quizData: any) {
  const prompt = `
Based on the following quiz responses, provide a comprehensive business fit analysis:

Quiz Data: ${JSON.stringify(quizData, null, 2)}

Please provide:
1. Top 3 recommended business models
2. Detailed analysis for each model
3. Risk assessment
4. Time to profitability estimates
5. Required skills and resources
6. Market opportunities

Format the response as structured JSON with the following structure:
{
  "recommendations": [
    {
      "businessModel": "string",
      "fitScore": number,
      "analysis": "string",
      "risks": "string",
      "timeToProfit": "string",
      "requiredSkills": ["string"],
      "marketOpportunity": "string"
    }
  ],
  "summary": "string"
}
`;

  // Add timeout to prevent hanging
  const response = await Promise.race([
    openai.chat.completions.create({
      model: "gpt-4o-mini", // Use gpt-4o-mini for faster responses
      messages: [
        {
          role: "system",
          content: "You are a business consultant specializing in helping people find the perfect business model based on their personality, skills, and goals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500, // Reduced to prevent timeouts
      temperature: 0.7
    }),
          new Promise((_, reject) =>
        setTimeout(() => {
          console.error("Business fit analysis OpenAI API call timed out after 15 seconds");
          reject(new Error("Business fit analysis OpenAI API call timed out after 15 seconds"));
        }, 15000)
      )
  ]) as any;

  return response.choices[0]?.message?.content || 'Analysis failed';
}

// Income projections should NOT be AI generated - they should be hardcoded data
// This function is removed to prevent AI generation of income projections

// Routes
(router as any).post('/openai-chat', async (req: any, res: any) => {
  try {
    console.log('OpenAI API request received:', {
      hasBody: !!(req.body as any),
      promptLength: ((req.body as any) as any)?.messages?.length || 0,
      maxTokens: ((req.body as any) as any)?.maxTokens,
      responseFormat: ((req.body as any) as any)?.responseFormat
    });
    
    const { messages, maxTokens = 1200, temperature = 0.7 } = openaiChatSchema.parse((req.body as any));
    
    console.log('🔑 Checking OpenAI API key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    console.log('🤖 Making OpenAI API call with messages count:', messages.length);
    console.log('🎛️ Request parameters:', { maxTokens, temperature });
    
    // Add timeout to prevent hanging
    const response = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4o-mini", // Use gpt-4o-mini for faster responses
        messages: messages as any,
        max_tokens: maxTokens,
        temperature: temperature
      }),
      new Promise((_, reject) =>
        setTimeout(() => {
          console.error("OpenAI API call timed out after 15 seconds");
          reject(new Error("OpenAI API call timed out after 15 seconds"));
        }, 15000)
      )
    ]) as any;
    
    console.log('📡 OpenAI API response status:', response.usage ? '200 OK' : 'Error');
    console.log('✅ OpenAI API success, response data keys:', Object.keys(response));
    console.log('📝 Content length:', response.choices[0]?.message?.content?.length || 0);
    
    (res as any).json({
      content: response.choices[0]?.message?.content,
      usage: response.usage,
      model: response.model
    });
  } catch (error: any) {
    console.error('OpenAI chat error:', error);
    (res as any).status(500).json({ error: 'OpenAI API error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

(router as any).post('/ai-business-fit-analysis', async (req: any, res: any) => {
  try {
    const { quizData, quizAttemptId } = businessFitAnalysisSchema.parse((req.body as any));
    
    // Generate analysis
    const analysis = await generateBusinessFitAnalysis(quizData);
    
    // Save to database
    const attempt = await prisma.quizAttempt.findFirst({
      where: { quizAttemptId }
    });
    
    if (attempt) {
      await prisma.aiContent.create({
        data: {
          quizAttemptId: attempt.id,
          content: analysis,
          contentType: 'business_fit_analysis'
        }
      });
    }
    
    (res as any).json({ analysis });
  } catch (error: any) {
    console.error('Business fit analysis error:', error);
    if (error instanceof z.ZodError) {
      return (res as any).status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

// Income projections endpoint removed - should use hardcoded data from server/routes.ts instead
// This prevents AI generation of income projections which should be consistent and reliable

(router as any).post('/generate-business-fit-descriptions', async (req: any, res: any) => {
  try {
    const { businessMatches, quizData } = (req.body as any);
    
    if (!businessMatches || !Array.isArray(businessMatches)) {
      return (res as any).status(400).json({ error: 'businessMatches array is required' });
    }
    
    const descriptions = await Promise.all(
      businessMatches.map(async (match: any) => {
        const prompt = `
Generate a detailed "Why This Fits You" description for the business model: ${match.name}

Based on the user's quiz data:
${JSON.stringify(quizData, null, 2)}

Business Match Details:
- Name: ${match.name}
- Fit Score: ${match.fitScore}%
- Description: ${match.description}
- Time to Profit: ${match.timeToProfit}
- Startup Cost: ${match.startupCost}
- Potential Income: ${match.potentialIncome}

Generate a detailed personalized analysis explaining why this business model specifically fits this user. Be specific about:
1. How their personality traits, goals, and preferences align with this business model
2. What specific aspects of their quiz responses make them well-suited for this path
3. How their skills, time availability, and risk tolerance match the requirements
4. What unique advantages they bring to this business model
5. How their learning style and work preferences complement this business approach

Write in a supportive, consultative tone that demonstrates deep understanding of their profile.
`;

        // Add timeout to prevent hanging
        const response = await Promise.race([
          openai.chat.completions.create({
            model: "gpt-4o-mini", // Use gpt-4o-mini for faster responses
            messages: [
              {
                role: "system",
                content: "You are a business consultant helping people understand why specific business models fit their unique profile."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 600, // Reduced to prevent timeouts
            temperature: 0.7
          }),
          new Promise((_, reject) =>
            setTimeout(() => {
              console.error("Business fit descriptions OpenAI API call timed out after 15 seconds");
              reject(new Error("Business fit descriptions OpenAI API call timed out after 15 seconds"));
            }, 15000)
          )
        ]) as any;

        return {
          businessId: match.id,
          description: response.choices[0]?.message?.content || 'Description unavailable'
        };
      })
    );
    
    (res as any).json({ descriptions });
  } catch (error: any) {
    console.error('Generate descriptions error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

// Skills analysis endpoint removed - not used in frontend

(router as any).post('/clear-business-model-ai-content', async (req: any, res: any) => {
  try {
    // Clear all AI content
    await prisma.aiContent.deleteMany({});
    
    (res as any).json({ message: 'AI content cleared successfully' });
  } catch (error: any) {
    console.error('Clear AI content error:', error);
    (res as any).status(500).json({ error: 'Internal server error' });
  }
});

// Health check for OpenAI
(router as any).get('/openai-status', async (req: any, res: any) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return (res as any).status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    // Test API call with timeout
    const response = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4o-mini", // Use gpt-4o-mini for faster responses
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10
      }),
      new Promise((_, reject) =>
        setTimeout(() => {
          console.error("OpenAI status check timed out after 10 seconds");
          reject(new Error("OpenAI status check timed out after 10 seconds"));
        }, 10000)
      )
    ]) as any;
    
    (res as any).json({ 
      status: 'ok',
      model: response.model,
      usage: response.usage
    });
  } catch (error: any) {
    console.error('OpenAI status check error:', error);
    (res as any).status(500).json({ error: 'OpenAI API error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router; 