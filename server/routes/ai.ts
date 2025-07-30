import express from 'express';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
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

const incomeProjectionsSchema = z.object({
  businessId: z.string(),
  quizData: z.any()
});

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

  const response = await openai.chat.completions.create({
    model: "gpt-4",
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
    max_tokens: 2000,
    temperature: 0.7
  });

  return response.choices[0]?.message?.content || 'Analysis failed';
}

// Helper function to generate income projections
async function generateIncomeProjections(businessId: string, quizData: any) {
  const prompt = `
Based on the business model "${businessId}" and the following quiz data, provide realistic income projections for the first 12 months:

Quiz Data: ${JSON.stringify(quizData, null, 2)}

Please provide monthly income projections that are realistic and achievable. Consider:
- Startup costs and time
- Market conditions
- Skill level and experience
- Competition
- Seasonal factors

Format as JSON:
{
  "projections": [
    {"month": 1, "income": number, "notes": "string"},
    {"month": 2, "income": number, "notes": "string"},
    ...
  ],
  "assumptions": "string",
  "riskFactors": ["string"]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a financial analyst specializing in startup income projections. Provide realistic, achievable projections."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 1500,
    temperature: 0.5
  });

  return response.choices[0]?.message?.content || 'Projections failed';
}

// Routes
router.post('/openai-chat', async (req: any, res: any) => {
  try {
    const { messages, maxTokens = 1200, temperature = 0.7 } = openaiChatSchema.parse(req.body);
    
    console.log('🔑 Checking OpenAI API key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    console.log('🤖 Making OpenAI API call with messages count:', messages.length);
    console.log('🎛️ Request parameters:', { maxTokens, temperature });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      max_tokens: maxTokens,
      temperature: temperature
    });
    
    console.log('📡 OpenAI API response status:', response.usage ? '200 OK' : 'Error');
    console.log('✅ OpenAI API success, response data keys:', Object.keys(response));
    console.log('📝 Content length:', response.choices[0]?.message?.content?.length || 0);
    
    res.json({
      content: response.choices[0]?.message?.content,
      usage: response.usage,
      model: response.model
    });
  } catch (error) {
    console.error('OpenAI chat error:', error);
    res.status(500).json({ error: 'OpenAI API error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/ai-business-fit-analysis', async (req: any, res: any) => {
  try {
    const { quizData, quizAttemptId } = businessFitAnalysisSchema.parse(req.body);
    
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
    
    res.json({ analysis });
  } catch (error) {
    console.error('Business fit analysis error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/generate-income-projections', async (req: any, res: any) => {
  try {
    const { businessId, quizData } = incomeProjectionsSchema.parse(req.body);
    
    // Generate projections
    const projections = await generateIncomeProjections(businessId, quizData);
    
    res.json({
      businessId,
      projections: JSON.parse(projections)
    });
  } catch (error) {
    console.error('Income projections error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/generate-business-fit-descriptions', async (req: any, res: any) => {
  try {
    const { businessModels } = req.body;
    
    const descriptions = await Promise.all(
      businessModels.map(async (model: any) => {
        const prompt = `
Generate a detailed description for the business model: ${model.name}

Include:
- What this business model entails
- Typical day-to-day activities
- Required skills and personality traits
- Pros and cons
- Ideal customer types
- Startup costs and timeline

Make it engaging and informative for someone considering this business model.
`;

        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a business consultant helping people understand different business models."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        });

        return {
          ...model,
          description: response.choices[0]?.message?.content || 'Description unavailable'
        };
      })
    );
    
    res.json({ descriptions });
  } catch (error) {
    console.error('Generate descriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/clear-business-model-ai-content', async (req: any, res: any) => {
  try {
    // Clear all AI content
    await prisma.aiContent.deleteMany({});
    
    res.json({ message: 'AI content cleared successfully' });
  } catch (error) {
    console.error('Clear AI content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check for OpenAI
router.get('/openai-status', async (req: any, res: any) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    // Test API call
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10
    });
    
    res.json({ 
      status: 'ok',
      model: response.model,
      usage: response.usage
    });
  } catch (error) {
    console.error('OpenAI status check error:', error);
    res.status(500).json({ error: 'OpenAI API error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router; 