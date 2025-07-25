// @ts-nocheck
import express from "express";

type Express = express.Express;
type Request = express.Request;
type Response = express.Response;
import { createServer, type Server } from "http";
import { storage } from './storage.js';
import { getUserIdFromRequest, getSessionKey } from "./auth.js";
import { requireAdminAuth } from "./middleware/adminAuth.js";
import { generateBusinessResources } from "./services/resourceService.js";
import { pdfService } from "./services/pdfService.js";
import { emailService } from "./services/emailService.js";
import { aiScoringService } from "./services/aiScoringService.js";
import { personalityAnalysisService } from "./services/personalityAnalysisService.js";
import { db } from "./db.js";
import Stripe from "stripe";
import {
  Client,
  Environment,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { 
  getRatingDescription, 
  getIncomeGoalRange, 
  getTimeCommitmentRange, 
  getInvestmentRange 
} from "./utils/quizUtils.js";
// import { registerDebugRoutes } from './debug-routes.js';

// Secure session/user-based rate limiter for OpenAI requests
class OpenAIRateLimiter {
  private requests = new Map<string, number[]>();
  private readonly maxRequestsPerUser = 50; // Max requests per user/session per hour
  private readonly windowMs = 60 * 60 * 1000; // 1 hour window
  private readonly maxAnonymousRequests = 10; // Lower limit for anonymous users
  private readonly cleanupInterval = 5 * 60 * 1000; // Clean up every 5 minutes

  constructor() {
    // Periodic cleanup to prevent memory leaks
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    let totalCleaned = 0;

    for (const [key, timestamps] of this.requests.entries()) {
      const validRequests = timestamps.filter(
        (time) => now - time < this.windowMs,
      );
      if (validRequests.length === 0) {
        this.requests.delete(key);
        totalCleaned++;
      } else if (validRequests.length < timestamps.length) {
        this.requests.set(key, validRequests);
      }
    }

    if (totalCleaned > 0) {
      console.log(
        ` Rate limiter cleanup: removed ${totalCleaned} expired entries`,
      );
    }
  }

  canMakeRequest(userId?: number, sessionId?: string): boolean {
    // Use userId if authenticated, otherwise use sessionId
    const identifier = userId
      ? `user_${userId}`
      : `session_${sessionId || "anonymous"}`;
    const isAuthenticated = !!userId;
    const maxRequests = isAuthenticated
      ? this.maxRequestsPerUser
      : this.maxAnonymousRequests;

    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const recentRequests = userRequests.filter(
      (time) => now - time < this.windowMs,
    );

    if (recentRequests.length >= maxRequests) {
      console.warn(
        ` Rate limit exceeded for ${identifier}: ${recentRequests.length}/${maxRequests} requests`,
      );
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    console.log(
      `✅ Rate limit check passed for ${identifier}: ${recentRequests.length}/${maxRequests} requests`,
    );
    return true;
  }

  getRemainingRequests(userId?: number, sessionId?: string): number {
    const identifier = userId
      ? `user_${userId}`
      : `session_${sessionId || "anonymous"}`;
    const isAuthenticated = !!userId;
    const maxRequests = isAuthenticated
      ? this.maxRequestsPerUser
      : this.maxAnonymousRequests;

    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(
      (time) => now - time < this.windowMs,
    );

    return Math.max(0, maxRequests - recentRequests.length);
  }
}

const openaiRateLimiter = new OpenAIRateLimiter();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    })
  : null;

// PayPal SDK configuration
const paypalClient =
  process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
    ? new Client({
        clientCredentialsAuthCredentials: {
          oAuthClientId: process.env.PAYPAL_CLIENT_ID,
          oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
        },
        environment:
          process.env.NODE_ENV === "production"
            ? Environment.Production
            : Environment.Sandbox,
      })
    : null;

const ordersController = paypalClient
  ? new OrdersController(paypalClient)
  : null;

// Utility functions moved to aiScoringService.ts to avoid duplication

// Add this helper at the top of the file
function isValidQuizAttemptId(id) {
  return typeof id === 'number' && isFinite(id) && id > 0;
}

// Helper to calculate expiresAt
function getQuizAttemptExpiresAt(userType) {
  const now = new Date();
  if (userType === 'guest') {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  } else if (userType === 'temporary') {
    return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 3 months
  } else {
    return null; // paid
  }
}

async function generateAndStoreAIContent(quizAttemptId, quizData) {
  // Generate results preview
  const preview = await aiScoringService.generateResultsPreview(quizData);
  await storage.saveAIContent(quizAttemptId, 'results-preview', preview);
  // Generate full report
  const fullReport = await aiScoringService.generateFullReport(quizData);
  await storage.saveAIContent(quizAttemptId, 'full-report', fullReport);
  // Add more AI content types as needed
}

// Utility: Claim all anonymous quiz attempts for a user by email or sessionId
async function claimAnonymousQuizAttemptsForUser(user, sessionId) {
  // Find all quiz attempts with userId: null and matching sessionId
  const anonymousAttempts = await storage.getAnonymousQuizAttemptsBySessionOrEmail(sessionId, user.email);
  for (const attempt of anonymousAttempts) {
    await storage.updateQuizAttempt(attempt.id, { userId: user.id });
    console.log(`[CLAIM] Linked anonymous quiz attempt ${attempt.id} to user ${user.id}`);
  }
}

export async function registerRoutes(app: Express): Promise<void> {
  // registerDebugRoutes(app);
  console.log("[DEBUG] registerRoutes called - registering main API routes");
  // Health check endpoint
  app.get("/api/health", async (req: Request, res: Response) => {
    try {
      // Optionally check database connection
      let dbStatus = 'unknown';
      try {
        await storage.testConnection();
        dbStatus = 'healthy';
      } catch (e) {
        dbStatus = 'unhealthy';
      }
      res.status(200).json({ status: 'ok', database: dbStatus, environment: process.env.NODE_ENV || 'unknown' });
    } catch (error) {
      res.status(500).json({ status: 'unhealthy', error: error instanceof Error ? error.message : String(error) });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // CORS preflight handler for OpenAI chat endpoint
  app.options("/api/openai-chat", (req: Request, res: Response) => {
    const origin = process.env.FRONTEND_URL || req.headers.origin || "*";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(200);
  });

  // OpenAI configuration status (secure - no sensitive info exposed)
  app.get("/api/openai-status", (req: Request, res: Response) => {
    const origin = process.env.FRONTEND_URL || req.headers.origin || "*";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    const hasApiKey = !!process.env.OPENAI_API_KEY;

    res.json({
      configured: hasApiKey,
      status: hasApiKey ? "ready" : "not_configured",
    });
  });

  // Stripe configuration endpoint (secure - only exposes publishable key)
  app.get("/api/stripe-config", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;

    res.json({
      publishableKey: publishableKey || null,
      configured: hasSecretKey,
      status: hasSecretKey ? "ready" : "not_configured",
    });
  });

  // General OpenAI chat endpoint
  app.post("/api/openai-chat", async (req: Request, res: Response) => {
    // Add CORS headers
    const origin = process.env.FRONTEND_URL || req.headers.origin || "*";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    try {
      console.log(" OpenAI API request received:", {
        hasBody: !!req.body,
        promptLength: req.body?.prompt?.length || 0,
        maxTokens: req.body?.maxTokens,
        responseFormat: req.body?.responseFormat,
      });

      // Secure rate limiting based on user/session instead of IP
      // Allow unauthenticated users by always generating a session key if not present
      let userId = await getUserIdFromRequest(req);
      // Prefer sessionId from body if provided, else from session
      const sessionId = req.body.sessionId || req.sessionID;
      if (!sessionId) {
        sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      }

      if (!openaiRateLimiter.canMakeRequest(userId, sessionId)) {
        console.log("Rate limit exceeded for user/session:", userId || sessionId);
        return res.status(429).json({
          error: "Too many requests. Please wait a moment before trying again.",
        });
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.error("OpenAI API key not configured");
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const {
        prompt,
        messages: directMessages,
        maxTokens = 1200,
        max_tokens,
        temperature = 0.7,
        responseFormat = null,
        systemMessage,
      } = req.body;

      let messages = [];

      // Support both old format (prompt + systemMessage) and new format (messages array)
      if (directMessages && Array.isArray(directMessages)) {
        // New format: messages array passed directly
        messages = directMessages;
      } else if (prompt) {
        // Old format: prompt + optional systemMessage
        if (systemMessage) {
          messages.push({
            role: "system",
            content: systemMessage,
          });
        }
        messages.push({
          role: "user",
          content: prompt,
        });
      } else {
        return res
          .status(400)
          .json({ error: "Either 'messages' array or 'prompt' is required" });
      }

      const requestBody: any = {
        model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
        messages,
        max_tokens: max_tokens || maxTokens,
        temperature: temperature,
      };

      // Add response format if specified (for JSON responses)
      if (responseFormat) {
        requestBody.response_format = responseFormat;
      }

      // Add timeout to OpenAI request
      const openaiResponse = (await Promise.race([
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
        }),
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error("OpenAI API request timed out after 30 seconds"),
              ),
            30000,
          ),
        ),
      ])) as Response;

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error(
          `OpenAI API error: ${openaiResponse.status}`,
          errorText,
        );
        throw new Error(
          `OpenAI API error: ${openaiResponse.status} - ${errorText}`,
        );
      }

      const data = await openaiResponse.json();
      console.log(
        "OpenAI API response received, content length:",
        data.choices?.[0]?.message?.content?.length || 0,
      );

      const content = data.choices[0].message.content;

      res.json({ content });
    } catch (error) {
      console.error("Error in OpenAI chat:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Handle rate limit errors specifically
      if (error instanceof Error && error.message.includes("429")) {
        console.warn(" Rate limited by OpenAI");
        res.status(429).json({
          error: "Rate limited by OpenAI",
          details: "Please try again in a few seconds",
          retry: true,
        });
      } else {
        res.status(500).json({
          error: "OpenAI API request failed",
          details: errorMessage,
        });
      }
    }
  });

  // Skills analysis endpoint using OpenAI
  app.post("/api/analyze-skills", async (req: Request, res: Response) => {
    try {
      const { quizData, requiredSkills, businessModel, userProfile } = req.body;

      const prompt = `
        Based on your quiz responses, analyze your current skill level for each required skill for ${businessModel}:

        YOUR PROFILE:
        ${userProfile}

        REQUIRED SKILLS:
        ${requiredSkills.map((skill: string) => `- ${skill}`).join("\n")}

        For each skill, determine:
        1. Status: "have" (you already have this skill), "working-on" (you have some experience but need development), or "need" (you don't have this skill)
        2. Confidence: 1-10 score of how confident you are in this assessment
        3. Reasoning: Brief explanation of why you categorized it this way

        Return a JSON object with this structure:
        {
          "skillAssessments": [
            {
              "skill": "skill name",
              "status": "have" | "working-on" | "need",
              "confidence": 1-10,
              "reasoning": "brief explanation"
            }
          ]
        }

        Base your assessment on:
        - Your experience level and existing skills
        - Your learning preferences and willingness to learn
        - Your time commitment and motivation
        - Your tech comfort level
        - Your communication and work preferences
        - Your past tools and experience indicators
      `;

      const openaiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
            messages: [
              {
                role: "system",
                content:
                  "You are an expert career coach and skills assessor. Analyze profiles and provide accurate skill assessments for business models. Always address the user directly using 'you' and 'your'.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        },
      );

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const data = await openaiResponse.json();
      const content = data.choices[0].message.content;
      const result = JSON.parse(content);

      // Store skills analysis in database if user is authenticated
      try {
        const userId = await getUserIdFromRequest(req);
        if (userId) {
          const attempts = await storage.getQuizAttempts(userId);
          const quizAttemptId = attempts.length > 0 ? attempts[0].id : undefined;
          if (quizAttemptId) {
            await storage.saveAIContentToQuizAttempt(
              quizAttemptId,
              `skills_${businessModel}`,
              result,
            );
            console.log(
              `✅ Skills analysis for ${businessModel} stored in database`,
            );
          }
        }
      } catch (dbError) {
        // Import error handler dynamically to avoid circular dependencies
        const { ErrorHandler } = await import("./utils/errorHandler.js");
        await ErrorHandler.handleStorageError(dbError as Error, {
          operation: "store_skills_analysis",
          context: {},
          isCritical: false, // Non-critical as the main result is still returned
          shouldThrow: false,
        });
      }

      res.json(result);
    } catch (error) {
      console.error("Error in skills analysis:", error);

      // Return fallback analysis
      const { requiredSkills } = req.body;
      const third = Math.ceil(requiredSkills.length / 3);

      const fallbackResult = {
        skillAssessments: [
          ...requiredSkills.slice(0, third).map((skill: string) => ({
            skill,
            status: "have",
            confidence: 7,
            reasoning:
              "Based on your quiz responses, you show strong aptitude for this skill",
          })),
          ...requiredSkills.slice(third, third * 2).map((skill: string) => ({
            skill,
            status: "working-on",
            confidence: 6,
            reasoning:
              "You have some experience but could benefit from further development",
          })),
          ...requiredSkills.slice(third * 2).map((skill: string) => ({
            skill,
            status: "need",
            confidence: 8,
            reasoning:
              "This skill would need to be developed for optimal success",
          })),
        ],
      };

      // Store fallback skills analysis in database if user is authenticated
      try {
        const userId = await getUserIdFromRequest(req);
        if (userId) {
          const attempts = await storage.getQuizAttempts(userId);
          const quizAttemptId = attempts.length > 0 ? attempts[0].id : undefined;
          if (quizAttemptId) {
            const { businessModel } = req.body;
            await storage.saveAIContentToQuizAttempt(
              quizAttemptId,
              `skills_${businessModel}`,
              fallbackResult,
            );
            console.log(
              `✅ Fallback skills analysis for ${businessModel} stored in database`,
            );
          }
        }
      } catch (dbError) {
        const { ErrorHandler } = await import("./utils/errorHandler.js");
        await ErrorHandler.handleStorageError(dbError as Error, {
          operation: "store_fallback_skills_analysis",
          context: {},
          isCritical: false,
          shouldThrow: false,
        });
      }

      res.json(fallbackResult);
    }
  });

  // AI-powered business fit scoring endpoint
  app.post(
    "/api/ai-business-fit-analysis",
    async (req: Request, res: Response) => {
      console.log(" AI business fit analysis request received");

      try {
        // Rate limiting for concurrent quiz takers
        const clientIP = req.ip || req.connection.remoteAddress || "unknown";
        if (!openaiRateLimiter.canMakeRequest(clientIP)) {
          console.log("❌ Rate limit exceeded for IP:", clientIP);
          return res.status(429).json({
            error:
              "Too many requests. Please wait a moment before trying again.",
          });
        }

        const { quizData } = req.body;

        if (!quizData) {
          console.log("❌ No quiz data provided");
          return res.status(400).json({ error: "Quiz data is required" });
        }

        // Add timeout to prevent hanging requests
        const analysisPromise = aiScoringService.analyzeBusinessFit(quizData);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Analysis timed out after 35 seconds")),
            35000,
          ),
        );

        const analysis = await Promise.race([analysisPromise, timeoutPromise]);
        console.log("AI business fit analysis completed successfully");
        res.json(analysis);
      } catch (error) {
        console.error("Error in AI business fit analysis:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : "No stack trace",
        });
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
          error: "Failed to analyze business fit",
          details: errorMessage,
        });
      }
    },
  );

  // Income projections endpoint using hardcoded data
  app.post(
    "/api/generate-income-projections",
    async (req: Request, res: Response) => {
      try {
        const { businessId } = req.body;

        if (!businessId) {
          return res.status(400).json({ error: "Business ID is required" });
        }

        // Use hardcoded projections based on business model
        const projections = getFallbackProjections(businessId);
        res.json(projections);
      } catch (error) {
        console.error("Error generating income projections:", error);
        res
          .status(500)
          .json({ error: "Failed to generate income projections" });
      }
    },
  );

  function getFallbackProjections(businessId: string) {
    const baseData: any = {
      "affiliate-marketing": {
        monthlyProjections: [
          {
            month: "Month 1",
            income: 0,
            cumulativeIncome: 0,
            milestones: ["Setup website", "Choose niche"],
          },
          {
            month: "Month 2",
            income: 50,
            cumulativeIncome: 50,
            milestones: ["First content published"],
          },
          {
            month: "Month 3",
            income: 200,
            cumulativeIncome: 250,
            milestones: ["First affiliate sale"],
          },
          {
            month: "Month 4",
            income: 500,
            cumulativeIncome: 750,
            milestones: ["Traffic growth"],
          },
          {
            month: "Month 5",
            income: 800,
            cumulativeIncome: 1550,
            milestones: ["SEO improvement"],
          },
          {
            month: "Month 6",
            income: 1200,
            cumulativeIncome: 2750,
            milestones: ["Email list building"],
          },
          { month: "Month 7", income: 1600, cumulativeIncome: 4350 },
          { month: "Month 8", income: 2000, cumulativeIncome: 6350 },
          { month: "Month 9", income: 2500, cumulativeIncome: 8850 },
          { month: "Month 10", income: 3000, cumulativeIncome: 11850 },
          { month: "Month 11", income: 3500, cumulativeIncome: 15350 },
          { month: "Month 12", income: 4000, cumulativeIncome: 19350 },
        ],
        averageTimeToProfit: "3-4 months",
        projectedYearOneIncome: 19350,
        keyFactors: [
          "Content quality",
          "SEO optimization",
          "Audience building",
          "Product selection",
        ],
        assumptions: [
          "20 hours/week commitment",
          "Consistent content creation",
          "Learning SEO basics",
        ],
      },
      freelancing: {
        monthlyProjections: [
          {
            month: "Month 1",
            income: 500,
            cumulativeIncome: 500,
            milestones: ["Profile setup", "First client"],
          },
          {
            month: "Month 2",
            income: 1200,
            cumulativeIncome: 1700,
            milestones: ["Portfolio building"],
          },
          {
            month: "Month 3",
            income: 2000,
            cumulativeIncome: 3700,
            milestones: ["Client testimonials"],
          },
          {
            month: "Month 4",
            income: 2800,
            cumulativeIncome: 6500,
            milestones: ["Rate increase"],
          },
          {
            month: "Month 5",
            income: 3500,
            cumulativeIncome: 10000,
            milestones: ["Repeat clients"],
          },
          {
            month: "Month 6",
            income: 4200,
            cumulativeIncome: 14200,
            milestones: ["Referral network"],
          },
          { month: "Month 7", income: 4800, cumulativeIncome: 19000 },
          { month: "Month 8", income: 5200, cumulativeIncome: 24200 },
          { month: "Month 9", income: 5600, cumulativeIncome: 29800 },
          { month: "Month 10", income: 6000, cumulativeIncome: 35800 },
          { month: "Month 11", income: 6200, cumulativeIncome: 42000 },
          { month: "Month 12", income: 6500, cumulativeIncome: 48500 },
        ],
        averageTimeToProfit: "1-2 months",
        projectedYearOneIncome: 48500,
        keyFactors: [
          "Skill level",
          "Portfolio quality",
          "Client communication",
          "Pricing strategy",
        ],
        assumptions: [
          "Existing marketable skills",
          "25 hours/week availability",
          "Professional presentation",
        ],
      },
    };

    return baseData[businessId] || baseData["affiliate-marketing"];
  }


  // Get a specific quiz attempt by ID
  app.get("/api/quiz-attempts/attempt/:quizAttemptId", async (req: Request, res: Response) => {
    try {
      const { userId, quizData } = req.body;

      if (!userId || !quizData) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let user = await storage.getUser(userId);
      if (!user) {
        user = await storage.createUser({
          email: `user${userId}@example.com`,
          password: "test123",
        });
      }

      const attemptsCount = await storage.getQuizAttemptsCount(userId);
      const isPaid = await storage.isPaidUser(userId);

      // Pure pay-per-report system logic:
      // - Everyone can take unlimited quiz attempts for free
      // - They pay per report unlock when they want full reports

      // Record the quiz attempt - stored permanently for all users now
      const attempt = await storage.recordQuizAttempt({
        userId,
        quizData,
      });

      // Note: Session establishment removed - frontend will handle user ID locally during quiz flow

      // No retake decrements in the new system
      console.log("Pay-per-quiz model - no retakes to decrement");

      res.json({
        success: true,
        attemptId: attempt.id,
        message: isPaid
          ? "Quiz attempt recorded permanently"
          : "Quiz attempt recorded (unpaid users: data retained for 24 hours)",
        isPaidUser: isPaid,
        dataRetentionPolicy: isPaid ? "permanent" : "24_hours",
      });
    } catch (error) {
      console.error("Error recording quiz attempt:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get quiz attempts history for a user
  app.get("/api/quiz-attempts/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const currentUserId = getUserIdFromRequest(req);

      // Check if user is authenticated
      if (!currentUserId) {
        console.log("Quiz attempt: Not authenticated", {
          sessionUserId: req.session?.userId,
          cacheUserId: currentUserId,
          sessionKey: getSessionKey(req),
        });
        return res.status(401).json({ error: "Not authenticated" });
      }

      const attempt = await storage.getQuizAttempt(userId);

      if (!attempt) {
        return res.status(404).json({ error: "Quiz attempt not found" });
      }

      // Check if user owns this quiz attempt
      if (attempt.userId !== currentUserId) {
        return res.status(403).json({ error: "Access denied" });
      }

      console.log(`Quiz attempt ${userId} retrieved for user ${currentUserId}`);
      res.json(attempt);
    } catch (error) {
      console.error("Error getting quiz attempt:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Save AI content for a specific quiz attempt
  app.post(
    "/api/quiz-attempts/attempt/:quizAttemptId/ai-content",
    async (req: Request, res: Response) => {
      try {
        const quizAttemptId = parseInt(req.params.quizAttemptId);
        const { contentType, content, aiContent } = req.body;
        const currentUserId = await getUserIdFromRequest(req);

        // Require authentication for AI content
        if (!currentUserId) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        // Support both new format (contentType + content) and old format (aiContent)
        const contentToSave = aiContent || content;
        if (!contentToSave) {
          return res.status(400).json({ error: "AI content is required" });
        }

        // Save to database
        await storage.saveAIContent(quizAttemptId, contentType || "results-preview", contentToSave);

        res.json({ success: true });
      } catch (error) {
        console.error("Error saving AI content:", error);
        res.status(500).json({ error: "Failed to save AI content" });
      }
    }
  );

  // Get AI content for a specific quiz attempt
  app.get(
    "/api/quiz-attempts/attempt/:quizAttemptId/ai-content",
    async (req: Request, res: Response) => {
      try {
        const quizAttemptId = parseInt(req.params.quizAttemptId);
        const { contentType } = req.query;
        const currentUserId = await getUserIdFromRequest(req);

        // Require authentication for AI content
        if (!currentUserId) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        const aiContent = await storage.getAIContent(quizAttemptId, contentType as string || "results-preview");
        res.json({ success: true, aiContent });
      } catch (error) {
        console.error("Error getting AI content:", error);
        res.status(500).json({ error: "Failed to get AI content" });
      }
    }
  );

  // Save email for quiz attempt and create user account
  app.post(
    "/api/quiz-attempts/attempt/:quizAttemptId/email",
    async (req: Request, res: Response) => {
      try {
        const quizAttemptId = parseInt(req.params.quizAttemptId);
        const { email } = req.body;
        const sessionId = req.sessionID;

        console.log("Email collection endpoint called:", {
          quizAttemptId,
          email,
          sessionId,
          sessionExists: !!req.session
        });

        if (!email) {
          return res.status(400).json({ error: "Email is required" });
        }

        // Get the quiz attempt to verify it exists and get session info
        const quizAttempt = await storage.getQuizAttempt(quizAttemptId);
        if (!quizAttempt) {
          return res.status(404).json({ error: "Quiz attempt not found" });
        }

        // Check if this is an anonymous attempt (has sessionId but no userId)
        if (!quizAttempt.userId && quizAttempt.sessionId) {
          console.log("Processing anonymous quiz attempt:", quizAttemptId);
          
          // Check if user already exists with this email
          let user = await storage.getUserByEmail(email);
          
          if (!user) {
            // Create new user with the provided email
            console.log("Creating new user with email:", email);
            user = await storage.createUser({
              email,
              password: "temp-password-" + Math.random().toString(36).substring(2), // Temporary password
            });
            console.log("User created with ID:", user.id);
          } else {
            console.log("User already exists with email:", email, "ID:", user.id);
          }

          // Link all anonymous attempts from this session to the user
          console.log("Linking anonymous attempts to user:", user.id);
          await claimAnonymousQuizAttemptsForUser(user, sessionId);

          // Set user ID in session for future requests
          req.session.userId = user.id;
          await new Promise<void>((resolve, reject) => {
            req.session.save((err: any) => {
              if (err) reject(err);
              else resolve();
            });
          });

          console.log("Session updated with userId:", user.id);

          res.json({ 
            success: true, 
            userId: user.id,
            message: "Email saved and quiz attempts linked to your account"
          });
        } else {
          // This is already a user-linked attempt, just save the email
          console.log("Quiz attempt already linked to user:", quizAttempt.userId);
          
          // Update user's email if it's different
          if (quizAttempt.userId) {
            const quizUser = await storage.getUser(quizAttempt.userId);
            if (quizUser && quizUser.email !== email) {
              await storage.updateUser(quizAttempt.userId, { email });
              console.log("Updated user email:", quizAttempt.userId);
            }
          }

          res.json({ 
            success: true, 
            userId: quizAttempt.userId,
            message: "Email updated successfully"
          });
        }
      } catch (error) {
        console.error("Error saving email:", error);
        res.status(500).json({ error: "Failed to save email" });
      }
    }
  );

  // Get latest quiz data for authenticated user (for business model pages)
  app.get("/api/auth/latest-quiz-data", async (req: Request, res: Response) => {
    console.log("LATEST QUIZ DATA: Endpoint called!");
    console.log("API: GET /api/auth/latest-quiz-data", {
      sessionId: req.sessionID,
      userId: req.session?.userId,
      hasCookie: !!req.headers.cookie,
    });

    try {
      // Debug session information before calling getUserIdFromRequest
      const sessionKey = getSessionKey(req);
      console.log("Latest quiz data: Session debug", {
        sessionUserId: req.session?.userId,
        sessionKey: sessionKey,
        userAgent: req.headers["user-agent"]?.substring(0, 50) + "...",
        ip: req.ip || req.connection.remoteAddress,
      });

      const userId = await getUserIdFromRequest(req);
      console.log("Latest quiz data: getUserIdFromRequest returned", userId);

      if (!userId) {
        console.log(
          "Latest quiz data: No userId found via getUserIdFromRequest",
        );

        console.log("Latest quiz data: Not authenticated - returning 401", {
          sessionUserId: req.session?.userId,
          cacheUserId: userId,
          sessionKey: getSessionKey(req),
        });
        return res.status(401).json({ error: "Not authenticated" });
      }

      console.log(
        `Latest quiz data: Authenticated user ${userId}, fetching attempts`,
      );

      console.log(`Latest quiz data: Fetching attempts for user ${userId}`);
      const attempts = await storage.getQuizAttempts(userId);
      console.log(
        `Latest quiz data: Found ${attempts.length} attempts for user ${userId}`,
      );

      if (attempts.length > 0) {
        console.log(
          `Latest quiz data: Returning quiz data for user ${userId}, attempt ${attempts[0].id}`,
        );
        res.json({
          quizData: attempts[0].quizData,
          quizAttemptId: attempts[0].id,
        });
      } else {
        console.log(
          `Latest quiz data: No attempts found for user ${userId}, returning null`,
        );
        res.json(null);
      }
    } catch (error) {
      console.error("Error getting latest quiz data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get latest PAID quiz data for authenticated user (for navigation guard)
  app.get(
    "/api/auth/latest-paid-quiz-data",
    async (req: Request, res: Response) => {
      console.log("API: GET /api/auth/latest-paid-quiz-data", {
        sessionId: req.sessionID,
        userId: req.session?.userId,
        hasCookie: !!req.headers.cookie,
      });

      try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        console.log(`Latest paid quiz data: Fetching for user ${userId}`);

        // Get user info
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const attempts = await storage.getQuizAttempts(userId);
        console.log(`Latest paid quiz data: Found ${attempts.length} attempts`);

        if (attempts.length === 0) {
          console.log("Latest paid quiz data: No attempts found");
          return res.json(null);
        }

        // In pure pay-per-report model: all logged-in users have access to their latest quiz data
        // They just need to pay per report unlock if they want full reports
        const latestAttempt = attempts[0]; // attempts are sorted by most recent
        console.log(
          `Latest paid quiz data: Returning latest attempt ${latestAttempt.id}`,
        );
        return res.json({
          quizData: latestAttempt.quizData,
          quizAttemptId: latestAttempt.id,
          isUnlocked: true,
        });
      } catch (error) {
        console.error("Error getting latest paid quiz data:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  // Save quiz data with 3-tier caching system
  app.post("/api/save-quiz-data", async (req: Request, res: Response) => {
    console.log("API: POST /api/save-quiz-data", {
      sessionId: req.sessionID,
      userId: req.session?.userId,
      hasCookie: !!req.headers.cookie,
    });

    try {
      const { quizData, email, paymentId } = req.body;
      if (!quizData) {
        console.log("Save quiz data: No quiz data provided");
        return res.status(400).json({ error: "Quiz data is required" });
      }

      const sessionKey = getSessionKey(req);
      const userId = await getUserIdFromRequest(req);

      console.log("Save quiz data: Processing with", {
        sessionKey,
        userId,
        hasEmail: !!email,
        userType: userId
          ? "authenticated"
          : email
            ? "email-provided"
            : "anonymous",
      });

      // TIER 1: Authenticated users - permanent database storage
      if (userId) {
        const user = await storage.getUser(userId);
        const isPaid = await storage.isPaidUser(userId);

        console.log(
          `Save quiz data: Authenticated user ${userId}, isPaid: ${isPaid}`,
        );

        // Always create a new quiz attempt for authenticated users

        // Save quiz data to user's account (permanent storage)
        let attempt = await storage.recordQuizAttempt({ quizData });
        if (userId) await storage.updateQuizAttempt(attempt.id, { userId });

        // Note: Session establishment removed - frontend will handle user ID locally during quiz flow

        console.log(
          `Save quiz data: Quiz attempt recorded with ID ${attempt.id} for authenticated user ${userId}`,
        );

        return res.json({
          success: true,
          attemptId: attempt.id,
          message: "Quiz data saved permanently",
          quizAttemptId: attempt.id,
          storageType: "permanent",
          userType: isPaid ? "paid" : "authenticated",
        });
      }

      // TIER 2: Users with email (unpaid) - 3-month database storage with expiration
      if (email) {
        let tempUser: User;
        let attempt: QuizAttempt;
        console.log(
          `Save quiz data: Processing email user: ${email}`,
        );

        // Check if ANY user (paid or temporary) already exists for this email
        const existingUser = await storage.getUserByEmail(email);
        
        if (existingUser && !existingUser.isTemporary) {
          // Found a paid user with this email - store under their account
          console.log(`Save quiz data: Found existing paid user for email: ${email}, storing under their account`);
          
          // Create quiz attempt for the existing paid user
          attempt = await storage.recordQuizAttempt({
            userId: existingUser.id,
            quizData,
          });

          // Note: Session establishment removed - frontend will handle user ID locally during quiz flow

          console.log(
            `Save quiz data: New quiz attempt recorded with ID ${attempt.id} for existing paid user ${existingUser.id} (${email})`,
          );

          return res.json({
            success: true,
            attemptId: attempt.id,
            message: "Quiz data saved to your existing account",
            quizAttemptId: attempt.id,
            storageType: "permanent",
            userType: "existing-paid",
            existingUserId: existingUser.id,
          });
        }
        
        if (existingUser && existingUser.isTemporary) {
          // Found a temporary user with this email - use it
          tempUser = existingUser;
          await storage.updateUser(tempUser.id, {
            sessionId: sessionKey,
            updatedAt: new Date(),
          });
          console.log(`Save quiz data: Updated session for existing temporary user for email: ${email}`);
        } else {
          // No user exists with this email - create new temporary user
          tempUser = await storage.storeTemporaryUser(sessionKey, email, {
            quizData,
            password: "temp-" + Math.random().toString(36).substring(2), // Always set a non-null password
          });
          console.log(`Save quiz data: Created new temporary user for email: ${email}`);
        }
        
        // Create quiz attempt for the user (always set userId)
        attempt = await storage.recordQuizAttempt({ quizData, userId: tempUser.id });
        await storage.updateQuizAttempt(attempt.id, { userId: tempUser.id });

        // Note: Session establishment removed - frontend will handle user ID locally during quiz flow

        console.log(
          `Save quiz data: New quiz attempt recorded with ID ${attempt.id} for temporary user ${tempUser.id} (${email})`,
        );

        return res.json({
          success: true,
          attemptId: attempt.id,
          message: "New quiz attempt saved for 3 months",
          quizAttemptId: attempt.id,
          storageType: "temporary",
          userType: "email-provided",
          expiresAt: tempUser.expiresAt,
          warning:
            "Your data will be automatically deleted after 3 months unless you upgrade to a paid account.",
        });
      }

      // TIER 3: Anonymous users (no email) - store in database with userId: null and sessionId
      const anonymousAttempt = await storage.recordQuizAttempt({ quizData, userId: null, sessionId: sessionKey });
      console.log(
        `Save quiz data: Anonymous user - quiz attempt recorded with ID ${anonymousAttempt.id} (session: ${sessionKey})`,
      );
      return res.json({
        success: true,
        attemptId: anonymousAttempt.id,
        message: "Quiz data saved anonymously in database",
        quizAttemptId: anonymousAttempt.id,
        storageType: "anonymous-db",
        userType: "anonymous",
        sessionId: sessionKey,
        warning: "Your data is stored anonymously in our database and will be deleted after 24 hours unless you provide an email or pay."
      });
    } catch (error) {
      console.error("Error saving quiz data:", error);
      res.status(500).json({
        error: "Failed to save quiz data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Test endpoint removed for production

  // Test endpoint removed for production

  // Test endpoint removed for production

  // Test endpoint removed for production

  // Test endpoint removed for production

  // Check for existing quiz attempts by email
  app.get("/api/check-existing-attempts/:email", async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      console.log(`Checking existing attempts for email: ${email}`);

      // Check for ANY user (paid or temporary) with this email
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser && !existingUser.isTemporary) {
        // Paid user
        const attempts = await storage.getQuizAttemptsByUserId(existingUser.id);
        return res.json({
          hasAccount: true,
          userType: "paid",
          userId: existingUser.id,
          attemptsCount: attempts.length,
          latestAttempt: attempts.length > 0 ? attempts[0] : null,
          message: "You have a paid account. Please log in to access your results.",
        });
      }
      
      if (existingUser && existingUser.isTemporary) {
        // Temporary user - treat as no real account
        return res.json({
          hasAccount: false,
          userType: "temporary",
          message: "Temporary user exists, but no real account. You can proceed to payment.",
        });
      }

      // No existing account
      return res.json({
        hasAccount: false,
        userType: "new",
        message: "No existing account found for this email.",
      });

    } catch (error) {
      console.error("Error checking existing attempts:", error);
      res.status(500).json({
        error: "Failed to check existing attempts",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Legacy endpoint for backward compatibility
  app.post("/api/auth/save-quiz-data", async (req: Request, res: Response) => {
    console.log(
      "API: Legacy /api/auth/save-quiz-data redirecting to new endpoint",
    );

    // Ensure user is authenticated for legacy endpoint
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Add userId to body and forward to new endpoint
    req.body.userId = userId;

    // Call new endpoint logic
    const { quizData, paymentId } = req.body;
    if (!quizData) {
      return res.status(400).json({ error: "Quiz data is required" });
    }

    try {
      const user = await storage.getUser(userId);
      const isPaid = await storage.isPaidUser(userId);

      // Check if user already has a recent quiz attempt (within last 5 minutes)
      const recentAttempts = await storage.getQuizAttempts(userId);
      const recentAttempt = recentAttempts.find(attempt => {
        const attemptTime = new Date(attempt.completedAt).getTime();
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        return attemptTime > fiveMinutesAgo;
      });

      if (recentAttempt) {
        console.log(
          `Legacy save quiz data: Found recent quiz attempt ${recentAttempt.id} for user ${userId}, skipping duplicate creation`,
        );
        return res.json({
          success: true,
          attemptId: recentAttempt.id,
          message: "Using existing quiz attempt",
          isFirstQuiz: false,
          requiresPayment: false,
          quizAttemptId: recentAttempt.id,
          isExisting: true,
        });
      }

      const attempt = await storage.recordQuizAttempt({
        userId: userId,
        quizData,
      });

      // Note: Session establishment removed - frontend will handle user ID locally during quiz flow

      console.log(
        `Legacy save quiz data: Quiz attempt recorded with ID ${attempt.id} for user ${userId}`,
      );

      res.json({
        success: true,
        attemptId: attempt.id,
        message: "Quiz data saved successfully",
        isFirstQuiz: (await storage.getQuizAttempts(userId)).length === 1,
        requiresPayment: false,
        quizAttemptId: attempt.id,
      });
    } catch (error) {
      console.error("Error in legacy save quiz data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Access pass concept removed - use report unlock payments instead

  // Get pricing for user without creating payment intent
  app.get("/api/user-pricing/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const pricingUser = await storage.getUser(parseInt(userId));
      if (!pricingUser) {
        return res.status(404).json({ error: "User not found" });
      }
      // Determine pricing: $9.99 for unpaid, $4.99 for paid
      const payments = await storage.getPaymentsByUser(parseInt(userId));
      let amountDollar;
      if (pricingUser.isPaid === true) {
        amountDollar = "4.99";
      } else {
        amountDollar = "9.99";
      }

      res.json({
        success: true,
        amount: amountDollar
      });
    } catch (error) {
      console.error("Error getting user pricing:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create Stripe payment intent for report unlock
  app.post(
    "/api/create-report-unlock-payment",
    async (req: Request, res: Response) => {
      try {
        let { userId, quizAttemptId, email, quizData } = req.body;

        console.log("Payment endpoint called with:", { userId, quizAttemptId, email, hasQuizData: !!quizData });

        // Handle anonymous users (no userId, no quizAttemptId, but has email and quizData)
        if (!userId && !quizAttemptId && email && quizData) {
          console.log("Processing anonymous user payment with email and quiz data");
          const sessionId = `anonymous_${Date.now()}_${Math.random().toString(36).substring(2)}`;
          try {
            // Always use storeTemporaryUser, which now reuses existing users
            const tempUser = await storage.storeTemporaryUser(sessionId, email, {
              quizData,
              password: "temp-" + Math.random().toString(36).substring(2),
            });
            // Create quiz attempt for the temporary user
            const attempt = await storage.recordQuizAttempt({
              userId: tempUser.id,
              quizData,
            });
            // Note: Session establishment removed - frontend will handle user ID locally during quiz flow
            console.log(`Created temporary user ${tempUser.id} and quiz attempt ${attempt.id} for anonymous payment`);
            // Use the user and quiz attempt
            userId = tempUser.id;
            quizAttemptId = attempt.id;
            var paymentUser = tempUser;
          } catch (createError) {
            if (createError.code === 'P2002') {
              console.info(`[INFO] Payment: User with email ${email} already exists, reusing existing user (non-fatal)`);
            } else {
              console.error("Error creating temporary user for anonymous payment:", createError);
              return res.status(500).json({ 
                error: "Failed to process anonymous payment",
                details: "Could not create temporary account"
              });
            }
          }
        }

        // Handle anonymous users (no userId, but has email and quizData)
        if (!userId && email && quizData) {
          console.log("Processing anonymous user payment with email and quiz data");
          // Create temporary user and quiz attempt for anonymous user
          const sessionId = `anonymous_${Date.now()}_${Math.random().toString(36).substring(2)}`;
          let tempUserObj;
          try {
            // Try to create temporary user
            tempUserObj = await storage.storeTemporaryUser(sessionId, email, {
              quizData,
              password: "temp-" + Math.random().toString(36).substring(2),
            });
            console.log(`Created new temporary user for email: ${email}`);
          } catch (err: any) {
            if (err.code === 'P2002') {
              // Unique constraint error: user already exists, fetch and reuse
              tempUserObj = await storage.prisma.user.findUnique({ where: { email } });
              if (tempUserObj) {
                console.log(`Reusing existing temporary user for email: ${email}`);
              } else {
                console.error(`Failed to fetch existing user after unique constraint error for email: ${email}`);
                return res.status(500).json({ error: "Failed to fetch existing user after unique constraint error" });
              }
            } else {
              console.error("Error creating temporary user for anonymous payment:", err);
              return res.status(500).json({ error: "Failed to create or fetch temporary user", details: err.message });
            }
          }
          // Always link the quiz attempt to the user
          if (!tempUserObj) {
            console.error("No temporary user object available after storeTemporaryUser");
            return res.status(500).json({ error: "No temporary user object available after storeTemporaryUser" });
          }
          let attempt = await storage.recordQuizAttempt({ quizData });
          await storage.updateQuizAttempt(attempt.id, { userId: tempUserObj.id });
          userId = tempUserObj.id;
          paymentUser = tempUserObj;
          quizAttemptId = attempt.id;
          console.log(`Linked quiz attempt ${attempt.id} to user ${tempUserObj.id}`);
        }

        // Handle existing anonymous quiz attempts (no userId, but has email and quizAttemptId)
        if (!userId && email && quizAttemptId) {
          console.log("Processing existing anonymous quiz attempt payment");
          // First, verify that the quiz attempt exists
          const parsedQuizAttemptId = parseInt(quizAttemptId.toString());
          let quizAttemptResult = null;
          for (let i = 0; i < 3; i++) {
            quizAttemptResult = await storage.getQuizAttempt(parsedQuizAttemptId);
            if (quizAttemptResult) break;
            await new Promise(res => setTimeout(res, 100));
          }
          if (!quizAttemptResult) {
            console.error(`Quiz attempt ${quizAttemptId} not found in database after retries`);
            return res.status(404).json({ 
              error: "Quiz attempt not found",
              details: `Quiz attempt ID ${quizAttemptId} does not exist`
            });
          }
          const quizAttempt = quizAttemptResult;
          // If the quiz attempt has no userId, create a temporary user and link it
          if (!quizAttempt.userId) {
            console.log("Linking anonymous quiz attempt to temporary user");
            const sessionId = `anonymous_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            try {
              // Always use storeTemporaryUser, which now reuses existing users
              const tempUser = await storage.storeTemporaryUser(sessionId, email, {
                quizData: quizAttempt.quizData,
                password: "temp-" + Math.random().toString(36).substring(2),
              });
              // Update the quiz attempt to link it to the temporary user
              await storage.updateQuizAttempt(parsedQuizAttemptId, { userId: tempUser.id });
              console.log(`Linked quiz attempt ${quizAttemptId} to temporary user ${tempUser.id}`);
              // Use the user
              userId = tempUser.id;
              var paymentUser = tempUser;
            } catch (createError) {
              console.error("Error creating temporary user for existing quiz attempt:", createError);
              return res.status(500).json({ 
                error: "Failed to process anonymous payment",
                details: "Could not create temporary account"
              });
            }
          } else {
            // Quiz attempt already has a userId, use it
            userId = quizAttempt.userId;
            var paymentUser = await storage.getUser(userId);
          }
        }

        // Improved error handling for missing or invalid quizAttemptId
        if (!quizAttemptId || isNaN(parseInt(quizAttemptId))) {
          return res.status(400).json({ error: "Missing or invalid quizAttemptId. Please retake the quiz or contact support." });
        }
        const parsedQuizAttemptId = parseInt(quizAttemptId.toString());

        console.log(`Parsed quiz attempt ID:`, parsedQuizAttemptId);
        
        // Direct database query to find the quiz attempt
        if (!db) {
          return res.status(500).json({ error: "Database not available" });
        }
        
        console.log(`Looking for quiz attempt ${parsedQuizAttemptId} in database...`);
        const quizAttemptResult = await storage.getQuizAttempt(parsedQuizAttemptId);
        console.log(`Direct database query result:`, quizAttemptResult);
        
        if (!quizAttemptResult) {
          console.error(`Quiz attempt ${quizAttemptId} not found in database`);
          return res.status(404).json({ 
            error: "Quiz attempt not found",
            details: `Quiz attempt ID ${quizAttemptId} does not exist`
          });
        }
        
        const quizAttempt = quizAttemptResult;
        console.log(`Found quiz attempt:`, quizAttempt);
        
        // Now find the user who created this quiz attempt
        if (!quizAttempt.userId) {
          return res.status(400).json({ 
            error: "Quiz attempt has no associated user",
            details: "Cannot process payment for anonymous quiz attempt"
          });
        }
        
        console.log(`Looking for user ${quizAttempt.userId} who created the quiz attempt...`);
        const userResult = await storage.getUser(quizAttempt.userId);
        console.log(`User query result:`, userResult);
        
        if (!userResult) {
          console.error(`User ${quizAttempt.userId} not found for quiz attempt ${quizAttemptId}`);
          return res.status(404).json({ 
            error: "User not found",
            details: `User ID ${quizAttempt.userId} does not exist`
          });
        }
        
        const finalUser = userResult;
        console.log(`Found user:`, { id: finalUser.id, email: finalUser.email });
        // Use the user ID from the quiz attempt, not from the request
        userId = finalUser.id;
        // Check if report is already unlocked
        const paymentsResult = await storage.getPaymentsByUser(userId);
        const existingPayment = paymentsResult.find(
          (p: any) =>
            p.quizAttemptId === quizAttemptId &&
            p.type === "report_unlock" &&
            p.status === "completed",
        );
        if (existingPayment) {
          return res.status(400).json({
            error: "Report is already unlocked for this quiz attempt"
          });
        }
        // Determine report unlock price based on finalUser.isPaid
        let amount, amountDollar;
        if (finalUser.isPaid === true) {
          amount = 499;
          amountDollar = "4.99";
        } else {
          amount = 999;
          amountDollar = "9.99";
        }
        console.log('[PRICING DEBUG] userId:', finalUser.id, 'isPaid:', finalUser.isPaid, 'Returning price:', amountDollar);
        // Create Stripe Payment Intent
        if (!stripe) {
          return res
            .status(500)
            .json({ error: "Payment processing not configured" });
        }
        let paymentIntent;
        try {
          paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            metadata: {
              userId: userId.toString(),
              type: "report_unlock",
              quizAttemptId: quizAttemptId.toString(),
              email: finalUser.email,
            },
            description: `BizModelAI Report Unlock - ${finalUser.isPaid ? "Paid user" : "Unpaid user"}`,
          });
        } catch (stripeError) {
          console.error("[STRIPE ERROR] PaymentIntent creation failed:", stripeError);
          return res.status(500).json({
            error: "Stripe payment intent creation failed",
            details: stripeError instanceof Error ? stripeError.message : String(stripeError)
          });
        }

        console.log(`Creating payment record with:`, {
          userId,
          amount: amountDollar,
          currency: "usd",
          type: "report_unlock",
          status: "pending",
          quizAttemptId: quizAttemptId,
          stripePaymentIntentId: paymentIntent.id,
        });

        // Extra debug logging
        console.log('DEBUG: About to call storage.createPayment with:', {
          userId,
          amount: amountDollar,
          currency: "usd",
          type: "report_unlock",
          status: "pending",
          quizAttemptId,
          stripePaymentIntentId: paymentIntent.id,
          version: 1,
        });

        try {
          // Create payment record directly in database
          const paymentData = {
            userId,
            amount: amountDollar.toString(),
            currency: "usd",
            type: "report_unlock",
            status: "pending",
            quizAttemptId,
            stripePaymentIntentId: paymentIntent.id,
            version: 1,
          };
          console.log('DEBUG: About to call storage.createPayment with data:', paymentData);
          const payment = await storage.createPayment(paymentData);
          console.log('DEBUG: storage.createPayment result:', payment);
          if (!payment || !payment.id) {
            console.error('Payment creation failed or returned undefined:', payment);
            return res.status(500).json({ error: 'Payment creation failed or returned undefined', details: payment });
          }
          // Log the response object
          const paymentResponse = {
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentId: payment.id,
            amount: amountDollar,
            quizAttemptId: quizAttemptId, // Return the quiz attempt ID for frontend
          };
          console.log('DEBUG: Payment response to client:', paymentResponse);
          res.json(paymentResponse);
        } catch (paymentError: any) {
          console.error("Error creating payment record:", paymentError);
          // If it's a foreign key constraint error, provide a more helpful message
          if (paymentError.message && paymentError.message.includes('foreign key constraint')) {
            console.error("Foreign key constraint error - quiz attempt may not exist");
            return res.status(400).json({
              error: "Quiz attempt not found",
              details: `The quiz attempt (ID: ${quizAttemptId}) could not be found. Please try again or contact support.`
            });
          }
          return res.status(500).json({ error: 'Payment creation failed', details: paymentError?.message || paymentError });
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.error('Unique constraint error (P2002) in payment endpoint:', error);
          // Try to fetch and return the existing user for debugging
          if (req.body && req.body.email) {
            const user = await storage.prisma.user.findUnique({ where: { email: req.body.email } });
            if (user) {
              return res.status(409).json({ error: 'User with this email already exists', user });
            }
          }
        }
        console.error("Error creating report unlock payment:", error);
        console.error("Error details:", {
          type: error?.type,
          message: error?.message,
          code: error?.code,
          stack: error?.stack
        });
        res.status(500).json({ 
          error: "Internal server error",
          details: error?.message || "Unknown error"
        });
      }
    },
  );

  // Register payment status route first for debugging
  console.log('[DEBUG] Registering /api/payment-status/:paymentId route...');
  app.get(
    "/api/payment-status/:paymentId",
    async (req: Request, res: Response) => {
      try {
        const { paymentId } = req.params;
        const paymentIdInt = parseInt(paymentId);

        if (!paymentIdInt) {
          return res.status(400).json({ error: "Invalid payment ID" });
        }

        // Get payment from database
        if (!db) {
          return res.status(500).json({ error: "Database not available" });
        }
        
        const paymentResult = await storage.getPaymentById(paymentIdInt);
        
        if (!paymentResult) {
          return res.status(404).json({ error: "Payment not found" });
        }

        const payment = paymentResult;

        // If it's a Stripe payment, check the payment intent status
        if (payment.stripePaymentIntentId && stripe) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
            return res.json({
              paymentId: payment.id,
              status: paymentIntent.status,
              amount: payment.amount,
              currency: payment.currency,
              type: payment.type,
              quizAttemptId: payment.quizAttemptId,
              stripePaymentIntentId: payment.stripePaymentIntentId,
              completedAt: payment.completedAt,
            });
          } catch (stripeError) {
            console.error("Error retrieving Stripe payment intent:", stripeError);
            return res.json({
              paymentId: payment.id,
              status: payment.status,
              amount: payment.amount,
              currency: payment.currency,
              type: payment.type,
              quizAttemptId: payment.quizAttemptId,
              error: "Could not retrieve Stripe status",
            });
          }
        }

        // For PayPal payments or if Stripe is not configured
        res.json({
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          type: payment.type,
          quizAttemptId: payment.quizAttemptId,
          paypalOrderId: payment.paypalOrderId,
          completedAt: payment.completedAt,
        });
      } catch (error) {
        console.error("Error getting payment status:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );
  console.log('[DEBUG] Registered /api/payment-status/:paymentId route.');

  // Get payment status by payment ID
  app.get(
    "/api/payment-status/:paymentId",
    async (req: Request, res: Response) => {
      try {
        const { paymentId } = req.params;
        const paymentIdInt = parseInt(paymentId);

        if (!paymentIdInt) {
          return res.status(400).json({ error: "Invalid payment ID" });
        }

        // Get payment from database
        if (!db) {
          return res.status(500).json({ error: "Database not available" });
        }
        
        const paymentResult = await db.select().from(payments).where(eq(payments.id, paymentIdInt));
        
        if (!paymentResult || paymentResult.length === 0) {
          return res.status(404).json({ error: "Payment not found" });
        }

        const payment = paymentResult[0];

        // If it's a Stripe payment, check the payment intent status
        if (payment.stripePaymentIntentId && stripe) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
            return res.json({
              paymentId: payment.id,
              status: paymentIntent.status,
              amount: payment.amount,
              currency: payment.currency,
              type: payment.type,
              quizAttemptId: payment.quizAttemptId,
              stripePaymentIntentId: payment.stripePaymentIntentId,
              completedAt: payment.completedAt,
            });
          } catch (stripeError) {
            console.error("Error retrieving Stripe payment intent:", stripeError);
            return res.json({
              paymentId: payment.id,
              status: payment.status,
              amount: payment.amount,
              currency: payment.currency,
              type: payment.type,
              quizAttemptId: payment.quizAttemptId,
              error: "Could not retrieve Stripe status",
            });
          }
        }

        // For PayPal payments or if Stripe is not configured
        res.json({
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          type: payment.type,
          quizAttemptId: payment.quizAttemptId,
          paypalOrderId: payment.paypalOrderId,
          completedAt: payment.completedAt,
        });
      } catch (error) {
        console.error("Error getting payment status:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  // PayPal payment creation endpoint for report unlock
  app.post(
    "/api/create-paypal-payment",
    async (req: Request, res: Response) => {
      try {
        if (!ordersController) {
          return res.status(500).json({ error: "PayPal not configured" });
        }

        let { userId, quizAttemptId, email } = req.body;

        console.log("PayPal endpoint called with:", { userId, quizAttemptId, email });

        // First, verify that the quiz attempt exists
        if (!quizAttemptId) {
          return res.status(400).json({ error: "Missing quizAttemptId" });
        }

        const parsedQuizAttemptId = parseInt(quizAttemptId.toString());
        console.log(`Parsed quiz attempt ID:`, parsedQuizAttemptId);
        
        // Direct database query to find the quiz attempt
        if (!db) {
          return res.status(500).json({ error: "Database not available" });
        }
        
        console.log(`Looking for quiz attempt ${parsedQuizAttemptId} in database...`);
        const quizAttemptResult = await storage.getQuizAttempt(parsedQuizAttemptId);
        console.log(`Direct database query result:`, quizAttemptResult);
        
        if (!quizAttemptResult) {
          console.error(`Quiz attempt ${quizAttemptId} not found in database`);
          return res.status(404).json({ 
            error: "Quiz attempt not found",
            details: `Quiz attempt ID ${quizAttemptId} does not exist`
          });
        }
        
        const quizAttempt = quizAttemptResult;
        console.log(`Found quiz attempt:`, quizAttempt);
        
        // Now find the user who created this quiz attempt
        if (!quizAttempt.userId) {
          return res.status(400).json({ 
            error: "Quiz attempt has no associated user",
            details: "Cannot process payment for anonymous quiz attempt"
          });
        }
        
        console.log(`Looking for user ${quizAttempt.userId} who created the quiz attempt...`);
        const userResult = await storage.getUser(quizAttempt.userId);
        console.log(`User query result:`, userResult);
        
        if (!userResult) {
          console.error(`User ${quizAttempt.userId} not found for quiz attempt ${quizAttemptId}`);
          return res.status(404).json({ 
            error: "User not found",
            details: `User ID ${quizAttempt.userId} does not exist`
          });
        }
        
        const user = userResult;
        console.log(`Found user:`, { id: user.id, email: user.email });
        
        userId = user.id;

        // Check if report is already unlocked
        const paymentsResult = await storage.getPaymentsByUser(userId);
        const existingPayment = paymentsResult.find(
          (p: any) =>
            p.quizAttemptId === quizAttemptId &&
            p.type === "report_unlock" &&
            p.status === "completed",
        );

        if (existingPayment) {
          return res.status(400).json({
            error: "Report is already unlocked for this quiz attempt"
          });
        }

        // Determine report unlock price based on user.isPaid
        let amount, paypalAmount;
        if (user.isPaid === true) {
          amount = 499;
          paypalAmount = "4.99";
        } else {
          amount = 999;
          paypalAmount = "9.99";
        }
        console.log('[PRICING DEBUG] userId:', user.id, 'isPaid:', user.isPaid, 'Returning price:', paypalAmount);
        const paymentType = "report_unlock";
        const description = `BizModelAI Report Unlock - ${paypalAmount === "4.99" ? "Paid user" : "Unpaid user"}`;

        // Create PayPal order
        const request = {
          body: {
            intent: "CAPTURE" as any,
            purchaseUnits: [
              {
                amount: {
                  currencyCode: "USD",
                  value: String(amount),
                },
                description: description,
                customId: JSON.stringify({
                  userId: userId.toString(),
                  type: paymentType,
                  quizAttemptId: quizAttemptId.toString(),
                }),
              },
            ],
            applicationContext: {
              returnUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success`,
              cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancelled`,
            },
          },
        };

        const order = await ordersController.createOrder(request);

        if (!order.result?.id) {
          throw new Error("Failed to create PayPal order");
        }

        // Create payment record directly in database
        const payment = await storage.createPayment({
          userId,
          amount: String(amount),
          currency: "usd",
          type: paymentType,
          status: "pending",
          quizAttemptId,
          paypalOrderId: order.result.id,
          version: 1,
        });

        res.json({
          success: true,
          orderID: order.result.id,
          paymentId: payment.id,
        });
      } catch (error: any) {
        console.error("Error creating PayPal payment:", error);
        console.error("Error details:", {
          message: error?.message,
          code: error?.code,
          stack: error?.stack
        });
        
        // Provide more specific error messages
        if (error?.message?.includes('authentication')) {
          return res.status(500).json({ 
            error: "PayPal authentication failed",
            details: "Please check PayPal credentials"
          });
        }
        
        if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
          return res.status(500).json({ 
            error: "PayPal service temporarily unavailable",
            details: "Please try again later"
          });
        }
        
        res.status(500).json({ 
          error: "PayPal payment creation failed",
          details: error?.message || "Unknown error"
        });
      }
    },
  );

  // PayPal payment capture endpoint
  app.post(
    "/api/capture-paypal-payment",
    async (req: Request, res: Response) => {
      try {
        if (!ordersController) {
          return res.status(500).json({ error: "PayPal not configured" });
        }

        const { orderID } = req.body;

        if (!orderID) {
          return res.status(400).json({ error: "Missing orderID" });
        }

        // Capture the PayPal order
        const request = {
          id: orderID,
          body: {},
        };

        const capture = await ordersController.captureOrder(request);

        if (capture.result?.status !== "COMPLETED") {
          throw new Error("PayPal payment capture failed");
        }

        // Extract custom data from the purchase unit
        const purchaseUnit = capture.result.purchaseUnits?.[0];
        if (!purchaseUnit?.customId) {
          throw new Error("Missing payment metadata");
        }

        const metadata = JSON.parse(purchaseUnit.customId);
        const {
          userId,
          type: paymentType,
          quizAttemptId,
        } = metadata;

        // Find the payment record in our database using PayPal order ID
        const userIdInt = parseInt(userId);
        const payments = await storage.getPaymentsByUser(userIdInt);
        const payment = payments.find((p: any) => p.paypalOrderId === orderID);

        if (!payment) {
          console.error("Payment record not found for PayPal order:", orderID);
          throw new Error("Payment record not found");
        }

        // Complete the payment in our system
        await storage.completePayment(payment.id);

        // Convert temporary user to permanent (set isTemporary: false)
        const user = await storage.getUser(userIdInt);
        if (user && user.isTemporary) {
          console.log(`[PAYPAL DEBUG] Before update: user.id=${user.id}, email=${user.email}, isTemporary=${user.isTemporary}`);
          await storage.updateUser(user.id, { isTemporary: false });
          const updatedUser = await storage.getUser(user.id);
          console.log(`[PAYPAL DEBUG] After update: user.id=${updatedUser.id}, email=${updatedUser.email}, isTemporary=${updatedUser.isTemporary}`);
          console.log(`Converted user ${user.id} (${user.email}) to permanent after PayPal payment.`);
        }

        console.log(
          `PayPal payment completed: ${paymentType} for user ${userIdInt}, quiz attempt ${quizAttemptId}`,
        );

        res.json({
          success: true,
          captureID: capture.result.id,
        });
      } catch (error) {
        console.error("Error capturing PayPal payment:", error);
        
        // Provide more specific error messages for different failure types
        if (error instanceof Error) {
          if (error.message.includes("invalid_client") || error.message.includes("Client Authentication failed")) {
            return res.status(500).json({ 
              error: "PayPal service temporarily unavailable",
              message: "Please try again later or use an alternative payment method"
            });
          }
          if (error.message.includes("orderID") || error.message.includes("order not found")) {
            return res.status(400).json({ 
              error: "Invalid payment order",
              message: "Please try the payment again"
            });
          }
        }
        
        res.status(500).json({ 
          error: "Payment processing error",
          message: "Please try again or contact support if the problem persists"
        });
      }
    },
  );

  // Stripe webhook endpoint
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Stripe webhook secret not configured");
      return res.status(400).send("Webhook secret not configured");
    }

    let event: Stripe.Event;

    try {
      if (!stripe) {
        return res.status(400).send("Payment processing not configured");
      }

      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;

          console.log("Payment succeeded:", paymentIntent.id);

          // Get metadata from payment intent
          const {
            userIdentifier,
            type,
            retakesGranted,
            sessionId,
          } = paymentIntent.metadata;

          if (!userIdentifier || !type) {
            console.error(
              "Missing metadata in payment intent:",
              paymentIntent.id,
            );
            break;
          }

          if ((paymentUser?.isTemporary || finalUser?.isTemporary) && sessionId) {
            // Handle temporary user - convert to permanent account
            try {
              // Get temporary account data
              const tempData = await storage.getTemporaryUser(sessionId);
              if (!tempData) {
                console.error(
                  "Temporary account data not found for session:",
                  sessionId,
                );
                break;
              }

              // Get signup data from tempData.tempQuizData
              const signupData = tempData.tempQuizData as any;
              const email = signupData?.email || tempData.email;
              const password = signupData?.password || tempData.password;
              const name = (signupData?.firstName || "") + (signupData?.lastName ? " " + signupData.lastName : "");

              if (!password) {
                console.error(
                  "Missing password in temporary user data for email:",
                  email,
                );
                console.error("Available fields:", Object.keys(signupData));
                break;
              }

              // Check if payment has already been processed for this payment intent
              const existingPayments = await storage.getPaymentsByStripeId(
                paymentIntent.id,
              );
              if (existingPayments.length > 0) {
                console.log(
                  `Payment ${paymentIntent.id} already processed, skipping.`,
                );
                break;
              }

              // Check if user already exists (safety check)
              let user = await storage.getUserByEmail(email);
              if (!user) {
                try {
                  // Create permanent user account
                  user = await storage.createUser({
                    email: email,
                    password: password, // Already hashed
                  });
                } catch (createUserError) {
                  // If user creation fails due to duplicate email, try to get the user again
                  // This can happen in rare race conditions
                  user = await storage.getUserByEmail(email);
                  if (!user) {
                    throw createUserError; // Re-throw if it's not a duplicate error
                  }
                  console.log(
                    `User ${email} already existed, using existing user.`,
                  );
                }
              }

              // Convert temporary user to permanent (set isTemporary: false)
              if (user.isTemporary) {
                console.log(`[WEBHOOK DEBUG] Before update: user.id=${user.id}, email=${user.email}, isTemporary=${user.isTemporary}`);
                await storage.updateUser(user.id, { isTemporary: false });
                // Fetch user again to confirm
                const updatedUser = await storage.getUser(user.id);
                console.log(`[WEBHOOK DEBUG] After update: user.id=${updatedUser.id}, email=${updatedUser.email}, isTemporary=${updatedUser.isTemporary}`);
                console.log(`Converted user ${user.id} (${email}) to permanent after payment.`);
              }

              // Create payment record
              const payment = await storage.createPayment({
                userId: user.id,
                amount: (paymentIntent.amount / 100).toFixed(2), // Convert cents to dollars
                currency: "usd",
                type: type || "access_pass",
                status: "pending",
                stripePaymentIntentId: paymentIntent.id,
              });

              // Complete the payment
              await storage.completePayment(payment.id);

              // Clean up temporary data
              await storage.cleanupExpiredUnpaidEmails();

              console.log(
                `Payment completed: ${type} for temporary user converted to user ${user.id}`,
              );
            } catch (error) {
              console.error("Error converting temporary user:", error);
            }
          } else {
            // Handle permanent user payment
            const userId = parseInt(userIdentifier);

            // Find the payment record in our database
            const payments = await storage.getPaymentsByUser(userId);
            const payment = payments.find(
              (p: any) => p.stripePaymentIntentId === paymentIntent.id,
            );

            if (!payment) {
              console.error(
                "Payment record not found for Stripe payment:",
                paymentIntent.id,
              );
              break;
            }

            // Complete the payment in our system
            await storage.completePayment(payment.id);

            console.log(`Payment completed: ${type} for user ${userId}`);
          }
          break;

        case "payment_intent.payment_failed":
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          console.log("Payment failed:", failedPayment.id);

          // Could update payment status to failed in database here
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Admin refund endpoints
  // Get all payments with optional pagination (admin only)
  app.get("/api/admin/payments", async (req: Request, res: Response) => {
    try {
      // TODO: Add admin authentication check here
      // For now, we'll add a simple API key check
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get query parameters for pagination and filtering
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000); // Max 1000 records
      const offset = parseInt(req.query.offset as string) || 0;
      const status = req.query.status as string;

      // Use optimized query that JOINs payments with users (fixes N+1 problem)
      const paymentsWithUsers = await storage.getPaymentsWithUsers({
        limit,
        offset,
        status,
      });

      res.json({
        payments: paymentsWithUsers,
        pagination: {
          limit,
          offset,
          total:
            paymentsWithUsers.length === limit
              ? "more_available"
              : paymentsWithUsers.length + offset,
        },
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Convert temporary user to permanent (admin only - for development/testing)
  app.post("/api/admin/convert-temp-user", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: "User ID is required",
        });
      }

      // Get the user record
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.isTemporary) {
        return res.status(400).json({ error: "User is already permanent" });
      }

      // Convert to permanent user by updating the database
      await storage.updateUser(userId, { isTemporary: false });

      console.log(`Admin converted temporary user ${userId} to permanent`);

      res.json({
        success: true,
        message: "User converted to permanent successfully",
        userId: userId,
      });
    } catch (error) {
      console.error("Error converting temporary user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Complete a payment (admin only - for development/testing)
  app.post("/api/admin/complete-payment", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      const { paymentId } = req.body;

      if (!paymentId) {
        return res.status(400).json({
          error: "Payment ID is required",
        });
      }

      // Get the payment record
      const payment = await storage.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.status === "completed") {
        return res.status(400).json({ error: "Payment is already completed" });
      }

      // Complete the payment
      await storage.completePayment(paymentId);

      console.log(`Admin completed payment ${paymentId} for user ${payment.userId}`);

      res.json({
        success: true,
        message: `Payment ${paymentId} completed successfully`,
        payment: {
          id: payment.id,
          userId: payment.userId,
          amount: payment.amount,
          type: payment.type,
          status: "completed",
        },
      });
    } catch (error) {
      console.error("Error completing payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Process a refund (admin only)
  app.post("/api/admin/refund", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      const { paymentId, amount, reason, adminNote } = req.body;

      if (!paymentId || !amount || !reason) {
        return res.status(400).json({
          error: "Payment ID, amount, and reason are required",
        });
      }

      // Get the payment record
      const payment = await storage.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // Check if payment is already fully refunded
      const existingRefunds = await storage.getRefundsByPayment(paymentId);
      const totalRefunded = existingRefunds
        .filter((r: any) => r.status === "succeeded")
        .reduce((sum: any, r: any) => sum + parseFloat(r.amount), 0);

      const paymentAmount = parseFloat(payment.amount);
      const requestedAmount = parseFloat(amount);

      if (totalRefunded + requestedAmount > paymentAmount) {
        return res.status(400).json({
          error: `Cannot refund $${requestedAmount}. Payment amount: $${paymentAmount}, already refunded: $${totalRefunded}`,
        });
      }

      // Create refund record
      const refund = await storage.createRefund({
        paymentId,
        amount: amount.toString(),
        currency: payment.currency || "usd",
        reason,
        status: "pending",
        adminNote: adminNote || null,
        adminUserId: null, // TODO: Get admin user ID from session
      });

      // Process refund with payment provider
      let refundResult: any = null;
      let providerRefundId: string = "";

      try {
        if (
          payment.stripePaymentIntentId &&
          payment.stripePaymentIntentId.startsWith("pi_")
        ) {
          // Stripe refund
          if (!stripe) {
            throw new Error("Stripe not configured");
          }

          refundResult = await stripe.refunds.create({
            payment_intent: payment.stripePaymentIntentId,
            amount: Math.round(requestedAmount * 100), // Convert to cents
            reason:
              reason === "requested_by_customer"
                ? "requested_by_customer"
                : "requested_by_customer",
          });

          providerRefundId = refundResult.id;

          // Update refund status
          await storage.updateRefundStatus(
            refund.id,
            "succeeded",
            new Date(),
            providerRefundId,
          );
        } else if (payment.stripePaymentIntentId) {
          // PayPal refund (stored in stripePaymentIntentId field)
          if (!ordersController) {
            throw new Error("PayPal not configured");
          }

          // For PayPal, we need the capture ID, not the order ID
          // This is a limitation - we should store capture IDs separately
          throw new Error(
            "PayPal refunds require capture ID - please process manually through PayPal dashboard",
          );
        } else {
          throw new Error("No payment provider ID found");
        }

        res.json({
          success: true,
          refund,
          providerRefundId,
          message: `Refund of $${requestedAmount} processed successfully`,
        });
      } catch (providerError) {
        console.error("Provider refund error:", providerError);

        // Update refund status to failed
        await storage.updateRefundStatus(refund.id, "failed", new Date());

        res.status(500).json({
          error: "Refund failed",
          details:
            providerError instanceof Error
              ? providerError.message
              : String(providerError),
          refundId: refund.id,
        });
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all refunds (admin only)
  app.get("/api/admin/refunds", async (req: Request, res: Response) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get query parameters for pagination
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000); // Max 1000 records
      const offset = parseInt(req.query.offset as string) || 0;

      const refunds = await storage.getAllRefunds(limit + offset);
      const paginatedRefunds = refunds.slice(offset, offset + limit);

      res.json({
        refunds: paginatedRefunds,
        pagination: {
          limit,
          offset,
          total:
            refunds.length === limit + offset
              ? "more_available"
              : refunds.length,
        },
      });
    } catch (error) {
      console.error("Error fetching refunds:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Clear business model AI content for new paid quiz attempts
  app.post("/api/clear-business-model-ai-content", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      console.log(`Clearing business model AI content for user ${userId} due to new paid quiz attempt`);

      // Get all AI content for this user's quiz attempts
      const userQuizAttempts = await storage.getQuizAttemptsByUserId(userId);
      
      let deletedCount = 0;
      
      for (const attempt of userQuizAttempts) {
        // Get all AI content for this quiz attempt
        const aiContent = await storage.getAllAIContentForQuizAttempt(attempt.id);
        
        // Delete only business model AI content (contentType starts with "model_")
        for (const content of aiContent) {
          if (content.contentType.startsWith("model_")) {
            await storage.deleteAIContent(attempt.id, content.contentType);
            deletedCount++;
            console.log(`Deleted business model AI content: ${content.contentType} for attempt ${attempt.id}`);
          }
        }
      }

      console.log(`Cleared ${deletedCount} business model AI content entries for user ${userId}`);
      
      res.json({ 
        success: true, 
        message: `Cleared ${deletedCount} business model AI content entries`,
        deletedCount 
      });
    } catch (error) {
      console.error("Error clearing business model AI content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PDF generation endpoint
  app.post("/api/generate-pdf", async (req: Request, res: Response) => {
    console.log('[PDF DEBUG] /api/generate-pdf route handler called');
    try {
      const { quizData, userEmail, aiAnalysis, topBusinessPath } = req.body;

      console.log("PDF generation request received", {
        hasQuizData: !!quizData,
        hasAIAnalysis: !!aiAnalysis,
        hasTopBusinessPath: !!topBusinessPath,
        userEmail,
      });

      if (!quizData) {
        return res.status(400).json({ error: "Quiz data is required" });
      }

      // Get the base URL from the request, fallback to current domain
      const baseUrl = req.get("host")?.includes("localhost")
        ? `${req.protocol}://${req.get("host")}`
        : "https://bizmodelai.com";
      console.log("Base URL:", baseUrl);

      // Generate PDF with AI data included
      const pdfBuffer = await pdfService.generatePDF({
        quizData,
        userEmail,
        aiAnalysis,
        topBusinessPath,
        baseUrl,
      });

      console.log("PDF generated successfully, size:", pdfBuffer.length);

      // Generate filename with user info
      const userName = userEmail?.split("@")[0] || "user";
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `business-report-${userName}-${timestamp}`;

      // Set headers for PDF download only
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.pdf"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF generation failed:", error);
      res.status(500).json({
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });


  // Check rate limit status for an email
  app.post("/api/check-rate-limit", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Missing email" });
      }

      // Check rate limit without actually sending an email
      const rateLimitCheck = await emailService.checkEmailRateLimitWithInfo(email);
      
      if (!rateLimitCheck.allowed) {
        res.status(429).json({ 
          error: "Rate limit exceeded", 
          rateLimitInfo: rateLimitCheck.info 
        });
      } else {
        res.json({ success: true, message: "No rate limit active" });
      }
    } catch (error) {
      console.error("Error checking rate limit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Generate detailed "Why This Fits You" descriptions for top 3 business matches
  app.post(
    "/api/generate-business-fit-descriptions",
    async (req: Request, res: Response) => {
      try {
        const { quizData, businessMatches } = req.body;

        if (!quizData || !businessMatches || !Array.isArray(businessMatches)) {
          return res.status(400).json({
            error: "Missing or invalid quiz data or business matches",
          });
        }

        const descriptions = [];

        for (let i = 0; i < businessMatches.length; i++) {
          const match = businessMatches[i];
          const rank = i + 1;

          const prompt = `Based on your quiz responses, generate a detailed "Why This Fits You" description for your ${rank === 1 ? "top" : rank === 2 ? "second" : "third"} business match.

Your Quiz Data:
- Main Motivation: ${quizData.mainMotivation}
- Weekly Time Commitment: ${getTimeCommitmentRange(quizData.weeklyTimeCommitment)}
- Income Goal: ${getIncomeGoalRange(quizData.successIncomeGoal)}
- Tech Skills Rating: ${getRatingDescription(quizData.techSkillsRating)}
- Risk Comfort Level: ${getRatingDescription(quizData.riskComfortLevel)}
- Self-Motivation Level: ${getRatingDescription(quizData.selfMotivationLevel)}
- Direct Communication Enjoyment: ${getRatingDescription(quizData.directCommunicationEnjoyment)}
- Creative Work Enjoyment: ${getRatingDescription(quizData.creativeWorkEnjoyment)}
- Work Structure Preference: ${quizData.workStructurePreference}
- Learning Preference: ${quizData.learningPreference}
- First Income Timeline: ${quizData.firstIncomeTimeline}
- Upfront Investment: ${getInvestmentRange(quizData.upfrontInvestment)}
- Brand Face Comfort: ${getRatingDescription(quizData.brandFaceComfort)}
- Long-term Consistency: ${getRatingDescription(quizData.longTermConsistency)}
- Trial & Error Comfort: ${getRatingDescription(quizData.trialErrorComfort)}
- Organization Level: ${getRatingDescription(quizData.organizationLevel)}
- Uncertainty Handling: ${getRatingDescription(quizData.uncertaintyHandling)}
- Work Collaboration Preference: ${quizData.workCollaborationPreference}
- Decision Making Style: ${quizData.decisionMakingStyle}
- Familiar Tools: ${quizData.familiarTools?.join(", ") || "None specified"}

Business Match:
- Name: ${match.name}
- Fit Score: ${match.fitScore}%
- Description: ${match.description}
- Time to Profit: ${match.timeToProfit}
- Startup Cost: ${match.startupCost}
- Potential Income: ${match.potentialIncome}

Generate a detailed personalized analysis of at least 6 sentences explaining why this business model specifically fits you. Write it as a cohesive paragraph, not bullet points. Be extremely specific about:
1. How your exact personality traits, goals, and preferences align with this business model
2. What specific aspects of your quiz responses make you well-suited for this path
3. How your skills, time availability, and risk tolerance perfectly match the requirements
4. What unique advantages you bring to this business model based on your specific answers
5. How your learning style and work preferences complement this business approach
6. Why this particular combination of traits makes you likely to succeed in this field

Reference specific quiz data points and explain the connections. Make it personal and specific to your responses, not generic advice. Write in a supportive, consultative tone that demonstrates deep understanding of your profile.

CRITICAL: Use ONLY the actual data provided above. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown in your profile. If you selected a range, always refer to the full range, never specific numbers within it. Always address the user directly using 'you' and 'your'.`;

          const openaiResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
                messages: [
                  {
                    role: "system",
                    content:
                      "You are an expert business consultant specializing in entrepreneurial personality matching. Generate personalized, specific explanations for why certain business models fit individual users based on their quiz responses.",
                  },
                  {
                    role: "user",
                    content: prompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: 500,
              }),
            },
          );

          if (!openaiResponse.ok) {
            throw new Error(`OpenAI API error: ${openaiResponse.status}`);
          }

          const data = await openaiResponse.json();
          const content = data.choices[0].message.content;

          descriptions.push({
            businessId: match.id,
            description:
              content ||
              `This business model aligns well with your ${quizData.selfMotivationLevel >= 4 ? "high self-motivation" : "self-driven nature"} and ${quizData.weeklyTimeCommitment} hours/week availability. Your ${quizData.techSkillsRating >= 4 ? "strong" : "adequate"} technical skills and ${quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance make this a suitable match for your entrepreneurial journey.`,
          });
        }

        // Store business fit descriptions in database if user is authenticated
        try {
          const userId = await getUserIdFromRequest(req);
          if (userId) {
            const attempts = await storage.getQuizAttempts(userId);
            const quizAttemptId = attempts.length > 0 ? attempts[0].id : undefined;
            if (quizAttemptId) {
              const descriptionsMap: { [key: string]: string } = {};
              descriptions.forEach((desc: any) => {
                descriptionsMap[desc.businessId] = desc.description;
              });
              await storage.saveAIContentToQuizAttempt(
                quizAttemptId,
                "businessFitDescriptions",
                descriptionsMap,
              );
              console.log("Business fit descriptions stored in database");
            }
          }
        } catch (dbError) {
          const { ErrorHandler } = await import("./utils/errorHandler.js");
          await ErrorHandler.handleStorageError(dbError as Error, {
            operation: "store_business_fit_descriptions",
            context: {},
            isCritical: false,
            shouldThrow: false,
          });
        }

        res.json({ descriptions });
      } catch (error) {
        console.error("Error generating business fit descriptions:", error);

        // Return fallback descriptions
        const fallbackDescriptions = req.body.businessMatches.map(
          (match: any, index: number) => ({
            businessId: match.id,
            description: `This business model aligns well with your ${req.body.quizData.selfMotivationLevel >= 4 ? "high self-motivation" : "self-driven nature"} and ${req.body.quizData.weeklyTimeCommitment} hours/week availability. Your ${req.body.quizData.techSkillsRating >= 4 ? "strong" : "adequate"} technical skills and ${req.body.quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance make this a ${index === 0 ? "perfect" : index === 1 ? "excellent" : "good"} match for your entrepreneurial journey.

${index === 0 ? "As your top match, this path offers the best alignment with your goals and preferences." : index === 1 ? "This represents a strong secondary option that complements your primary strengths." : "This provides a solid alternative path that matches your core capabilities."} Your ${req.body.quizData.learningPreference?.replace("-", " ")} learning style and ${req.body.quizData.workStructurePreference?.replace("-", " ")} work preference make this business model particularly suitable for your success.`,
          }),
        );

        // Store fallback business fit descriptions in database if user is authenticated
        try {
          const userId = await getUserIdFromRequest(req);
          if (userId) {
            const attempts = await storage.getQuizAttempts(userId);
            const quizAttemptId = attempts.length > 0 ? attempts[0].id : undefined;
            if (quizAttemptId) {
              const descriptionsMap: { [key: string]: string } = {};
              fallbackDescriptions.forEach((desc: any) => {
                descriptionsMap[desc.businessId] = desc.description;
              });
              await storage.saveAIContentToQuizAttempt(
                quizAttemptId,
                "businessFitDescriptions",
                descriptionsMap,
              );
              console.log(
                "✅ Fallback business fit descriptions stored in database",
              );
            }
          }
        } catch (dbError) {
          const { ErrorHandler } = await import("./utils/errorHandler.js");
          await ErrorHandler.handleStorageError(dbError as Error, {
            operation: "store_fallback_business_fit_descriptions",
            context: {},
            isCritical: false,
            shouldThrow: false,
          });
        }

        res.json({ descriptions: fallbackDescriptions });
      }
    },
  );

  // Generate detailed "Why This Doesn't Fit Your Current Profile" descriptions for bottom 3 business matches
  app.post(
    "/api/generate-business-avoid-descriptions",
    async (req: Request, res: Response) => {
      try {
        const { quizData, businessMatches } = req.body;

        if (!quizData || !businessMatches || !Array.isArray(businessMatches)) {
          return res.status(400).json({
            error: "Missing or invalid quiz data or business matches",
          });
        }

        const descriptions = [];

        for (let i = 0; i < businessMatches.length; i++) {
          const match = businessMatches[i];
          const rank = i + 1;

          const prompt = `Based on your quiz responses, generate a detailed "Why This Doesn't Fit Your Current Profile" description for your ${rank === 1 ? "lowest scoring" : rank === 2 ? "second lowest scoring" : "third lowest scoring"} business match.

Your Quiz Data:
- Main Motivation: ${quizData.mainMotivation}
- Weekly Time Commitment: ${getTimeCommitmentRange(quizData.weeklyTimeCommitment)}
- Income Goal: ${getIncomeGoalRange(quizData.successIncomeGoal)}
- Tech Skills Rating: ${getRatingDescription(quizData.techSkillsRating)}
- Risk Comfort Level: ${getRatingDescription(quizData.riskComfortLevel)}
- Self-Motivation Level: ${getRatingDescription(quizData.selfMotivationLevel)}
- Direct Communication Enjoyment: ${getRatingDescription(quizData.directCommunicationEnjoyment)}
- Creative Work Enjoyment: ${getRatingDescription(quizData.creativeWorkEnjoyment)}
- Work Structure Preference: ${quizData.workStructurePreference}
- Learning Preference: ${quizData.learningPreference}
- First Income Timeline: ${quizData.firstIncomeTimeline}
- Upfront Investment: ${getInvestmentRange(quizData.upfrontInvestment)}
- Brand Face Comfort: ${getRatingDescription(quizData.brandFaceComfort)}
- Long-term Consistency: ${getRatingDescription(quizData.longTermConsistency)}
- Trial & Error Comfort: ${getRatingDescription(quizData.trialErrorComfort)}
- Organization Level: ${getRatingDescription(quizData.organizationLevel)}
- Uncertainty Handling: ${getRatingDescription(quizData.uncertaintyHandling)}
- Work Collaboration Preference: ${quizData.workCollaborationPreference}
- Decision Making Style: ${quizData.decisionMakingStyle}
- Familiar Tools: ${quizData.familiarTools?.join(", ") || "None specified"}

Business Match:
- Name: ${match.name}
- Fit Score: ${match.fitScore}%
- Description: ${match.description}
- Time to Profit: ${match.timeToProfit}
- Startup Cost: ${match.startupCost}
- Potential Income: ${match.potentialIncome}

Generate a detailed personalized analysis of at least 6 sentences explaining why this business model doesn't fit your current profile. Write it as a cohesive paragraph, not bullet points. Be specific about:
1. What specific personality traits, goals, or preferences conflict with this business model
2. Which exact quiz responses indicate poor alignment with this path
3. How your skills, time availability, or risk tolerance don't match the requirements
4. What challenges you would likely face based on your specific profile
5. Why your learning style and work preferences would struggle with this business approach
6. What would need to change in your profile before this could become viable

Reference specific quiz data points and explain the misalignments. Be honest but constructive. Write in a supportive tone that helps you understand why focusing on better-matched opportunities would be wiser.

CRITICAL: Use ONLY the actual data provided above. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown in your profile. If you selected a range, always refer to the full range, never specific numbers within it. Always address the user directly using 'you' and 'your'.`;

          const openaiResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
                messages: [
                  {
                    role: "system",
                    content:
                      "You are an expert business consultant specializing in entrepreneurial personality matching. Generate personalized, specific explanations for why certain business models don't fit individual users based on their quiz responses. Be honest but constructive, helping users understand misalignments.",
                  },
                  {
                    role: "user",
                    content: prompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: 500,
              }),
            },
          );

          if (!openaiResponse.ok) {
            throw new Error(`OpenAI API error: ${openaiResponse.status}`);
          }

          const data = await openaiResponse.json();
          const content = data.choices[0].message.content;

          descriptions.push({
            businessId: match.id,
            description:
              content ||
              `This business model doesn't align well with your current profile. Your ${quizData.riskComfortLevel <= 2 ? "lower risk tolerance" : "risk preferences"} and ${quizData.weeklyTimeCommitment} hours/week availability suggest other business models would be more suitable. Your ${quizData.techSkillsRating >= 4 ? "strong" : "adequate"} technical skills and ${quizData.selfMotivationLevel >= 4 ? "high" : "moderate"} self-motivation level indicate potential challenges with this path. Consider focusing on business models that better match your strengths and current situation.`,
          });
        }

        // Store business avoid descriptions in database if user is authenticated
        try {
          const userId = await getUserIdFromRequest(req);
          if (userId) {
            const attempts = await storage.getQuizAttempts(userId);
            const quizAttemptId = attempts.length > 0 ? attempts[0].id : undefined;
            if (quizAttemptId) {
              const descriptionsMap: { [key: string]: string } = {};
              descriptions.forEach((desc: any) => {
                descriptionsMap[desc.businessId] = desc.description;
              });
              await storage.saveAIContentToQuizAttempt(
                quizAttemptId,
                "businessAvoidDescriptions",
                descriptionsMap,
              );
              console.log("Business avoid descriptions stored in database");
            }
          }
        } catch (dbError) {
          const { ErrorHandler } = await import("./utils/errorHandler.js");
          await ErrorHandler.handleStorageError(dbError as Error, {
            operation: "store_business_avoid_descriptions",
            context: {},
            isCritical: false,
            shouldThrow: false,
          });
        }

        res.json({ descriptions });
      } catch (error) {
        console.error("Error generating business avoid descriptions:", error);

        // Return fallback descriptions
        const fallbackDescriptions = req.body.businessMatches.map(
          (match: any, index: number) => ({
            businessId: match.id,
            description: `This business model scored ${match.fitScore}% for your profile, indicating significant misalignment with your current goals, skills, and preferences. Based on your quiz responses, you would likely face substantial challenges in this field that could impact your success. Consider focusing on higher-scoring business models that better match your natural strengths and current situation.`,
          }),
        );

        // Store fallback business avoid descriptions in database if user is authenticated
        try {
          const userId = await getUserIdFromRequest(req);
          if (userId) {
            const attempts = await storage.getQuizAttempts(userId);
            const quizAttemptId = attempts.length > 0 ? attempts[0].id : undefined;
            if (quizAttemptId) {
              const descriptionsMap: { [key: string]: string } = {};
              fallbackDescriptions.forEach((desc: any) => {
                descriptionsMap[desc.businessId] = desc.description;
              });
              await storage.saveAIContentToQuizAttempt(
                quizAttemptId,
                "businessAvoidDescriptions",
                descriptionsMap,
              );
              console.log(
                "✅ Fallback business avoid descriptions stored in database",
              );
            }
          }
        } catch (dbError) {
          const { ErrorHandler } = await import("./utils/errorHandler.js");
          await ErrorHandler.handleStorageError(dbError as Error, {
            operation: "store_fallback_business_avoid_descriptions",
            context: {},
            isCritical: false,
            shouldThrow: false,
          });
        }

        res.json({ descriptions: fallbackDescriptions });
      }
    },
  );

  // AI Content Migration Endpoint
  app.post(
    "/api/admin/migrate-ai-content",
    async (req: Request, res: Response) => {
      try {
        console.log(" Starting AI content migration...");

        let result = null;
        // Just call the migration method if it exists on storage
        if (typeof storage.migrateAIContentToNewTable === 'function') {
          result = await storage.migrateAIContentToNewTable();
        }

        console.log("AI content migration completed successfully");
        res.json({
          success: true,
          message: "AI content migration completed",
          ...result,
        });
      } catch (error) {
        console.error("❌ AI content migration failed:", error);
        res.status(500).json({
          success: false,
          error: "Migration failed",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Get stored email for unpaid users
  app.get(
    "/api/get-stored-email/:sessionId",
    async (req: Request, res: Response) => {
      try {
        const { sessionId } = req.params;
        const storedUser = await storage.getTemporaryUser(sessionId);

        if (storedUser) {
          res.json({ email: storedUser.email });
        } else {
          res.json({ email: null });
        }
      } catch (error) {
        console.error("Error getting stored email:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  // Get all collected emails endpoint for marketing/advertising
  app.get("/api/admin/all-emails", async (req: Request, res: Response) => {
    try {
      console.log("Fetching all collected emails...");

      // Get emails from paid users (permanent storage)
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      const paidUsers = await db.user.findMany({
        where: { email: { not: null } },
        select: { email: true, source: sql`'paid_user'`, createdAt: true },
      });

      // Get emails from unpaid/temporary users (including expired ones for marketing)
      const unpaidUsers = await db.user.findMany({
        where: { isTemporary: true },
        select: { email: true, source: sql`'unpaid_user'`, createdAt: true, expiresAt: true },
      });

      // Combine and deduplicate emails
      const allEmails = [...paidUsers, ...unpaidUsers];
      const uniqueEmails = new Map();

      allEmails.forEach((emailRecord) => {
        if (!emailRecord.email) return;
        const email = emailRecord.email.toLowerCase();
        if (!uniqueEmails.has(email) || emailRecord.source === "paid_user") {
          // Prefer paid user records over unpaid user records
          uniqueEmails.set(email, emailRecord);
        }
      });

      const emailList = Array.from(uniqueEmails.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      res.json({
        success: true,
        totalEmails: emailList.length,
        emails: emailList,
        summary: {
          paidUsers: paidUsers.length,
          unpaidUsers: unpaidUsers.length,
          uniqueEmails: emailList.length,
        },
      });
    } catch (error) {
      console.error("Error fetching all emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  // Send email endpoint for testing
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html, quizAttemptId } = req.body;
      if (!to || !subject || !html) {
        return res.status(400).json({ success: false, error: "Missing to, subject, or html" });
      }
      const result = await emailService.sendEmail({ to, subject, html, quizAttemptId });
      console.log('[EMAIL DEBUG] /api/send-email result:', result);
      if (result.success) {
        res.json({ success: true });
      } else if (result.rateLimitInfo) {
        res.status(429).json({ success: false, error: "Rate limit exceeded", rateLimitInfo: result.rateLimitInfo });
      } else {
        res.status(500).json({ success: false, error: result.error || "Failed to send email" });
      }
    } catch (error) {
      console.error("Error in /api/send-email:", error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get payment details by paymentId (for test/dev only)
  app.get("/api/payment/:paymentId", async (req: Request, res: Response) => {
    try {
      const paymentId = parseInt(req.params.paymentId);
      if (!paymentId) {
        return res.status(400).json({ error: "Invalid payment ID" });
      }
      const payment = await storage.getPaymentById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json({ success: true, payment });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // TEST-ONLY: Mark a user as paid by email (development only)
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/admin/mark-user-paid', async (req: Request, res: Response) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ error: 'Email is required' });
        }
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        await storage.updateUser(user.id, { isPaid: true, isTemporary: false });
        res.json({ success: true, userId: user.id });
      } catch (error) {
        res.status(500).json({ error: 'Failed to mark user as paid', details: error?.message });
      }
    });
  }

  // --- TEST-ONLY ENDPOINTS (development only) ---
  if (process.env.NODE_ENV !== 'production') {
    // Create or update a user with isPaid=true
    app.post('/api/test-setup-user', async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
      try {
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(password, 10);
        let user = await storage.prisma.user.findUnique({ where: { email } });
        if (user) {
          user = await storage.prisma.user.update({
            where: { email },
            data: { password: passwordHash, isPaid: true, isTemporary: false }
          });
        } else {
          user = await storage.prisma.user.create({
            data: { email, password: passwordHash, isPaid: true, isTemporary: false }
          });
        }
        res.json({ success: true, user });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Create or update a paid quiz attempt for the user
    app.post('/api/test-setup-quiz-attempt', async (req, res) => {
      const { email, isPaid } = req.body;
      if (!email) return res.status(400).json({ error: 'Missing email' });
      try {
        const user = await storage.prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        // Find or create a quiz attempt
        let attempt = await storage.prisma.quizAttempt.findFirst({ where: { userId: user.id } });
        if (attempt) {
          attempt = await storage.prisma.quizAttempt.update({
            where: { id: attempt.id },
            data: { isPaid: !!isPaid }
          });
        } else {
          attempt = await storage.prisma.quizAttempt.create({
            data: {
              userId: user.id,
              quizData: {
                mainMotivation: 'financial_freedom',
                brandFaceComfort: 4,
                riskComfortLevel: 3,
                techSkillsRating: 4,
                organizationLevel: 4,
                successIncomeGoal: 5000,
                upfrontInvestment: 500,
                learningPreference: 'hands_on',
                firstIncomeTimeline: '3-6_months',
                longTermConsistency: 4,
                selfMotivationLevel: 4,
                weeklyTimeCommitment: 20,
                creativeWorkEnjoyment: 4,
                workCollaborationPreference: 'independent',
                directCommunicationEnjoyment: 5
              },
              isPaid: !!isPaid,
              completedAt: new Date(),
            }
          });
        }
        res.json({ success: true, attempt });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
}
