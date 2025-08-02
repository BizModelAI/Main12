// @ts-nocheck
import express from "express";

// Express types will be inferred
import { createServer, type Server } from "http";
import { storage } from './storage';
import { getUserIdFromRequest, getSessionKey } from "./auth";
import { requireAdminAuth } from "./middleware/adminAuth";
import { generateBusinessResources } from "./services/resourceService";
import { pdfService } from "./services/pdfService";
import { emailService } from "./services/emailService";

// Function to generate PDF report HTML with clean, simple design
function generatePDFReportHTML(data: any): string {
  const { quizData, userEmail, aiAnalysis, topBusinessPath, businessScores } = data;

  // Helper functions
  const escapeHtml = (text: string | undefined | null): string => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  const formatCurrency = (value: number | undefined | null): string => {
    if (typeof value !== "number" || isNaN(value)) return "0";
    return value.toLocaleString();
  };

  const formatScore = (score: number) => `${score}%`;

  // Get top 3 and bottom 3 business scores
  const topBusinesses = businessScores?.slice(0, 3) || [];
  const bottomBusinesses = businessScores?.slice(-3).reverse() || [];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Business Path Analysis Report</title>
        <style>
            @page {
                margin: 1in;
                size: A4;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #374151;
                margin: 0;
                padding: 0;
            }
            
            .page {
                page-break-after: always;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            .page:last-child {
                page-break-after: auto;
            }
            
            .hero {
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 60px 40px;
                text-align: center;
                margin-bottom: 40px;
                border-radius: 16px;
            }
            
            .hero h1 {
                font-size: 36px;
                font-weight: 700;
                margin: 0 0 16px 0;
                color: white;
            }
            
            .hero p {
                font-size: 18px;
                margin: 0;
                color: #dbeafe;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            .section {
                background: white;
                border-radius: 12px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                page-break-inside: avoid;
            }
            
            .section h2 {
                font-size: 24px;
                font-weight: 600;
                color: #1f2937;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
            }
            
            .stat-number {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            
            .stat-label {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                color: #64748b;
                margin-bottom: 4px;
            }
            
            .stat-desc {
                font-size: 11px;
                color: #94a3b8;
            }
            
            .business-card {
                background: #f8fafc;
                border-left: 4px solid #10b981;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 16px;
            }
            
            .business-card.avoid {
                background: #fef3c7;
                border-left-color: #f59e0b;
            }
            
            .business-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .business-name {
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
            }
            
            .business-score {
                font-size: 20px;
                font-weight: 700;
            }
            
            .business-score.good {
                color: #059669;
            }
            
            .business-score.avoid {
                color: #d97706;
            }
            
            .business-desc {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.4;
            }
            
            .recommendation {
                background: #f0fdf4;
                border-left: 3px solid #10b981;
                border-radius: 6px;
                padding: 16px;
                margin-bottom: 12px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            
            .recommendation-icon {
                color: #10b981;
                font-weight: bold;
                font-size: 16px;
                flex-shrink: 0;
            }
            
            .recommendation-text {
                font-size: 13px;
                color: #374151;
                line-height: 1.4;
            }
            
            .ai-analysis {
                background: #faf5ff;
                border: 1px solid #e9d5ff;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .ai-analysis h3 {
                color: #7c3aed;
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 12px 0;
            }
            
            .ai-analysis p {
                color: #4c1d95;
                font-size: 13px;
                line-height: 1.5;
                margin: 0;
            }
            
            .footer {
                text-align: center;
                padding: 20px;
                color: #9ca3af;
                font-size: 12px;
                border-top: 1px solid #e5e7eb;
                margin-top: 40px;
            }
            
            /* Personality Sliders */
            .personality-section {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .personality-section h3 {
                color: #374151;
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 16px 0;
            }
            
            .personality-sliders {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .personality-trait {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            
            .trait-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .trait-name {
                font-size: 13px;
                font-weight: 500;
                color: #374151;
            }
            
            .trait-score {
                font-size: 12px;
                font-weight: 600;
                color: #3b82f6;
            }
            
            .slider-container {
                width: 100%;
            }
            
            .slider-track {
                width: 100%;
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                position: relative;
                overflow: hidden;
            }
            
            .slider-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            
            @media print {
                body { 
                    print-color-adjust: exact; 
                    -webkit-print-color-adjust: exact;
                }
                .section { page-break-inside: avoid; }
                .business-card { page-break-inside: avoid; }
                .recommendation { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <!-- Hero Section -->
        <div class="hero">
            <h1>Your Business Path Analysis</h1>
            <p>AI-powered insights and personalized recommendations for your entrepreneurial journey</p>
        </div>

        <div class="container">
            <!-- Executive Summary -->
            <div class="section">
                <h2>📊 Executive Summary</h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" style="color: #3b82f6;">${topBusinessPath?.score || 85}%</div>
                        <div class="stat-label">Best Match</div>
                        <div class="stat-desc">${topBusinessPath?.name || 'Freelancing'}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" style="color: #059669;">${quizData.weeklyTimeCommitment}</div>
                        <div class="stat-label">Hours/Week</div>
                        <div class="stat-desc">Available Time</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" style="color: #7c3aed;">$${formatCurrency(quizData.successIncomeGoal)}</div>
                        <div class="stat-label">Income Goal</div>
                        <div class="stat-desc">Monthly Target</div>
                    </div>
                </div>

                <!-- Personality Profile -->
                <div class="personality-section">
                    <h3>🧠 Personality Profile</h3>
                    ${quizData.personalityTraits ? `
                    <div class="personality-sliders">
                        <div class="personality-trait">
                            <div class="trait-header">
                                <span class="trait-name">Extroversion</span>
                                <span class="trait-score">${quizData.personalityTraits.extroversion || 50}%</span>
                            </div>
                            <div class="slider-container">
                                <div class="slider-track">
                                    <div class="slider-fill" style="width: ${quizData.personalityTraits.extroversion || 50}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="personality-trait">
                            <div class="trait-header">
                                <span class="trait-name">Conscientiousness</span>
                                <span class="trait-score">${quizData.personalityTraits.conscientiousness || 50}%</span>
                            </div>
                            <div class="slider-container">
                                <div class="slider-track">
                                    <div class="slider-fill" style="width: ${quizData.personalityTraits.conscientiousness || 50}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="personality-trait">
                            <div class="trait-header">
                                <span class="trait-name">Openness</span>
                                <span class="trait-score">${quizData.personalityTraits.openness || 50}%</span>
                            </div>
                            <div class="slider-container">
                                <div class="slider-track">
                                    <div class="slider-fill" style="width: ${quizData.personalityTraits.openness || 50}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="personality-trait">
                            <div class="trait-header">
                                <span class="trait-name">Agreeableness</span>
                                <span class="trait-score">${quizData.personalityTraits.agreeableness || 50}%</span>
                            </div>
                            <div class="slider-container">
                                <div class="slider-track">
                                    <div class="slider-fill" style="width: ${quizData.personalityTraits.agreeableness || 50}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="personality-trait">
                            <div class="trait-header">
                                <span class="trait-name">Neuroticism</span>
                                <span class="trait-score">${quizData.personalityTraits.neuroticism || 50}%</span>
                            </div>
                            <div class="slider-container">
                                <div class="slider-track">
                                    <div class="slider-fill" style="width: ${quizData.personalityTraits.neuroticism || 50}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>

                ${aiAnalysis?.summary ? `
                <div class="ai-analysis">
                    <h3>🤖 AI Analysis Summary</h3>
                    <p>${escapeHtml(aiAnalysis.summary)}</p>
                </div>
                ` : ''}
            </div>

            <!-- Top Business Matches -->
            <div class="section">
                <h2>🎯 Your Top Business Matches</h2>
                
                ${topBusinesses.map((business, index) => `
                <div class="business-card">
                    <div class="business-header">
                        <div class="business-name">${index + 1}. ${escapeHtml(business.name)}</div>
                        <div class="business-score good">${formatScore(business.score)}</div>
                    </div>
                    ${business.description ? `<div class="business-desc">${escapeHtml(business.description)}</div>` : ''}
                </div>
                `).join('')}
            </div>

            <!-- Businesses to Avoid -->
            <div class="section">
                <h2>⚠️ Businesses to Avoid</h2>
                
                ${bottomBusinesses.map((business, index) => `
                <div class="business-card avoid">
                    <div class="business-header">
                        <div class="business-name">${escapeHtml(business.name)}</div>
                        <div class="business-score avoid">${formatScore(business.score)}</div>
                    </div>
                    ${business.description ? `<div class="business-desc">${escapeHtml(business.description)}</div>` : ''}
                </div>
                `).join('')}
            </div>

            <!-- AI Recommendations -->
            ${aiAnalysis?.recommendations && aiAnalysis.recommendations.length > 0 ? `
            <div class="section">
                <h2>💡 AI Recommendations</h2>
                
                ${aiAnalysis.recommendations.map((rec: string) => `
                <div class="recommendation">
                    <div class="recommendation-icon">✓</div>
                    <div class="recommendation-text">${escapeHtml(rec)}</div>
                </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- Footer -->
            <div class="footer">
                Generated by BizModelAI • ${new Date().toLocaleDateString()}
            </div>
        </div>
    </body>
    </html>
  `;
}
import { aiScoringService } from "./services/aiScoringService";
// Personality analysis service removed - not used in frontend
import { db } from "./db";
import Stripe from "stripe";
// PayPal SDK imports removed - using mocks only
import { 
  getRatingDescription, 
  getIncomeGoalRange, 
  getTimeCommitmentRange, 
  getInvestmentRange 
} from "./utils/quizUtils";
// import { registerDebugRoutes } from './debug-routes';

// Secure session/user-based rate limiter for OpenAI requests
class OpenAIRateLimiter {
  private userRequests: Map<string, number[]> = new Map();
  private anonymousRequests: Map<string, number[]> = new Map();
  private readonly maxRequestsPerUser = 50; // Increased from 20
  private readonly maxAnonymousRequests = 10; // Increased from 5
  private readonly windowMs = 60000; // 1 minute
  private readonly cleanupInterval = 2 * 60 * 1000; // 2 minutes
  private cleanupTimer: NodeJS.Timeout;

  constructor() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    let totalCleaned = 0;

    for (const [key, timestamps] of this.userRequests.entries()) {
      const validRequests = timestamps.filter(
        (time) => now - time < this.windowMs,
      );
      if (validRequests.length === 0) {
        this.userRequests.delete(key);
        totalCleaned++;
      } else if (validRequests.length < timestamps.length) {
        this.userRequests.set(key, validRequests);
      }
    }

    for (const [key, timestamps] of this.anonymousRequests.entries()) {
      const validRequests = timestamps.filter(
        (time) => now - time < this.windowMs,
      );
      if (validRequests.length === 0) {
        this.anonymousRequests.delete(key);
        totalCleaned++;
      } else if (validRequests.length < timestamps.length) {
        this.anonymousRequests.set(key, validRequests);
      }
    }

    if (totalCleaned > 0) {
      console.log(
        `🧹 Route rate limiter cleanup: removed ${totalCleaned} expired entries`,
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
    const requestMap = isAuthenticated ? this.userRequests : this.anonymousRequests;
    const userRequests = requestMap.get(identifier) || [];

    // Remove old requests outside the window
    const recentRequests = userRequests.filter(
      (time) => now - time < this.windowMs,
    );

    if (recentRequests.length >= maxRequests) {
      console.warn(
        `⚠️ Rate limit exceeded for ${identifier}: ${recentRequests.length}/${maxRequests} requests`,
      );
      return false;
    }

    recentRequests.push(now);
    requestMap.set(identifier, recentRequests);

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
    const requestMap = isAuthenticated ? this.userRequests : this.anonymousRequests;
    const userRequests = requestMap.get(identifier) || [];
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

// PayPal SDK configuration - DISABLED (using mocks only)
const paypalClient = null;
const ordersController = null;

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

export async function registerRoutes(app: any): Promise<void> {
  // registerDebugRoutes(app);
  console.log("[DEBUG] registerRoutes called - registering main API routes");




  // AI-powered business fit scoring endpoint
  (app as any).post(
    "/api/ai-business-fit-analysis",
    async (req: any, res: any) => {
      console.log(" AI business fit analysis request received");

      try {
        // Rate limiting for concurrent quiz takers
        const clientIP = (req.ip as any) || req.connection.remoteAddress || "unknown";
        if (!openaiRateLimiter.canMakeRequest(undefined, clientIP)) {
          console.log("❌ Rate limit exceeded for IP:", clientIP);
          return (res as any).status(429).json({
            error:
              "Too many requests. Please wait a moment before trying again.",
          });
        }

        const { quizData } = (req.body as any);

        if (!quizData) {
          console.log("❌ No quiz data provided");
          return (res as any).status(400).json({ error: "Quiz data is required" });
        }

        // Add timeout to prevent hanging requests
        const analysisPromise = aiScoringService.analyzeBusinessFit(quizData);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Analysis timed out after 15 seconds")),
            15000, // Reduced from 25000
          ),
        );
        const analysis = await Promise.race([analysisPromise, timeoutPromise]);
        console.log("AI business fit analysis completed successfully");
        (res as any).json(analysis);
      } catch (error: any) {
        console.error("Error in AI business fit analysis:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : "No stack trace",
        });
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        (res as any).status(500).json({
          error: "Failed to analyze business fit",
          details: errorMessage,
        });
      }
    },
  );

  // Income projections endpoint using hardcoded data
  (app as any).post(
    "/api/generate-income-projections",
    async (req: any, res: any) => {
      try {
        const { businessId, businessModel } = (req.body as any);

        if (!businessId && !businessModel) {
          return (res as any).status(400).json({ error: "Business ID or Business Model is required" });
        }

        // Use businessId if provided, otherwise use businessModel
        const identifier = businessId || businessModel;
        
        // Use hardcoded projections based on business model
        const projections = getFallbackProjections(identifier);
        (res as any).json(projections);
      } catch (error: any) {
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
  (app as any).get("/api/quiz-attempts/attempt/:quizAttemptId", async (req: any, res: any) => {
    try {
      const { userId, quizData } = (req.body as any);

      if (!userId || !quizData) {
        return (res as any).status(400).json({ error: "Missing required fields" });
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

      (res as any).json({
        success: true,
        attemptId: attempt.id,
        message: isPaid
          ? "Quiz attempt recorded permanently"
          : "Quiz attempt recorded (unpaid users: data retained for 24 hours)",
        isPaidUser: isPaid,
        dataRetentionPolicy: isPaid ? "permanent" : "24_hours",
      });
    } catch (error: any) {
      console.error("Error recording quiz attempt:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Get quiz attempts history for a user
  (app as any).get("/api/quiz-attempts/user/:userId", async (req: any, res: any) => {
    try {
      const userId = parseInt((req.params as any).userId);
      const currentUserId = await getUserIdFromRequest(req);

      // Check if user is authenticated
      if (!currentUserId) {
        console.log("Quiz attempts: Not authenticated", {
          sessionUserId: (req.session as any)?.userId,
          cacheUserId: currentUserId,
          sessionKey: getSessionKey(req),
        });
        return (res as any).status(401).json({ error: "Not authenticated" });
      }

      // Check if user is requesting their own data
      if (currentUserId !== userId) {
        return (res as any).status(403).json({ error: "Access denied" });
      }

      const attempts = await storage.getQuizAttemptsByUserId(userId);

      console.log(`Quiz attempts retrieved for user ${userId}: ${attempts.length} attempts`);
      (res as any).json(attempts);
    } catch (error: any) {
      console.error("Error getting quiz attempts:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });



  // Check report unlock status for a specific quiz attempt
  (app as any).get(
    "/api/report-unlock-status/:userId/:quizAttemptId",
    async (req: any, res: any) => {
      try {
        const userId = parseInt((req.params as any).userId);
        const quizAttemptId = parseInt((req.params as any).quizAttemptId);
        const currentUserId = await getUserIdFromRequest(req);

        // Check if user is authenticated
        if (!currentUserId) {
          return (res as any).status(401).json({ error: "Not authenticated" });
        }

        // Check if user is requesting their own data
        if (currentUserId !== userId) {
          return (res as any).status(403).json({ error: "Access denied" });
        }

        // Check if quiz attempt exists and belongs to user
        const quizAttempt = await storage.getQuizAttempt(quizAttemptId);
        if (!quizAttempt) {
          return (res as any).status(404).json({ error: "Quiz attempt not found" });
        }

        if (quizAttempt.userId !== userId) {
          return (res as any).status(403).json({ error: "Access denied" });
        }

        // Check if the user has paid for this specific report
        const hasPaid = await storage.hasUserPaidForReport(userId, quizAttemptId);

        (res as any).json({
          success: true,
          isUnlocked: hasPaid,
          hasPaid,
          quizAttemptId,
          userId
        });
      } catch (error: any) {
        console.error("Error checking report unlock status:", error);
        (res as any).status(500).json({ error: "Failed to check unlock status" });
      }
    }
  );

  // Save email for quiz attempt and create user account
  (app as any).post(
    "/api/quiz-attempts/attempt/:quizAttemptId/email",
    async (req: any, res: any) => {
      try {
        const quizAttemptId = parseInt((req.params as any).quizAttemptId);
        const { email } = (req.body as any);
        const sessionId = (req.sessionID as any);

        console.log("Email collection endpoint called:", {
          quizAttemptId,
          email,
          sessionId,
          sessionExists: !!(req.session as any)
        });

        if (!email) {
          return (res as any).status(400).json({ error: "Email is required" });
        }

        // Get the quiz attempt to verify it exists and get session info
        const quizAttempt = await storage.getQuizAttempt(quizAttemptId);
        if (!quizAttempt) {
          return (res as any).status(404).json({ error: "Quiz attempt not found" });
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
          (req.session as any).userId = user.id;
          await new Promise<void>((resolve, reject) => {
            (req.session as any).save((err: any) => {
              if (err) reject(err);
              else resolve();
            });
          });

          console.log("Session updated with userId:", user.id);

          (res as any).json({ 
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

          (res as any).json({ 
            success: true, 
            userId: quizAttempt.userId,
            message: "Email updated successfully"
          });
        }
      } catch (error: any) {
        console.error("Error saving email:", error);
        (res as any).status(500).json({ error: "Failed to save email" });
      }
    }
  );



  // Save quiz data with 3-tier caching system
  (app as any).post("/api/save-quiz-data", async (req: any, res: any) => {
    console.log("API: POST /api/save-quiz-data", {
      sessionId: (req.sessionID as any),
      userId: (req.session as any)?.userId,
      hasCookie: !!(req.headers as any).cookie,
    });

    try {
      const { quizData, email, paymentId } = (req.body as any);
      if (!quizData) {
        console.log("Save quiz data: No quiz data provided");
        return (res as any).status(400).json({ error: "Quiz data is required" });
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

        return (res as any).json({
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
        
        if (existingUser && existingUser.isPaid) {
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

          return (res as any).json({
            success: true,
            attemptId: attempt.id,
            message: "Quiz data saved to your existing account",
            quizAttemptId: attempt.id,
            storageType: "permanent",
            userType: "existing-paid",
            existingUserId: existingUser.id,
          });
        }
        
        if (existingUser && !existingUser.isPaid) {
          // Found an unpaid user with this email - store under their account
          console.log(`Save quiz data: Found existing unpaid user for email: ${email}, storing under their account`);
          
          // Create quiz attempt for the existing unpaid user
          attempt = await storage.recordQuizAttempt({
            userId: existingUser.id,
            quizData,
          });

          console.log(
            `Save quiz data: New quiz attempt recorded with ID ${attempt.id} for existing unpaid user ${existingUser.id} (${email})`,
          );

          return (res as any).json({
            success: true,
            attemptId: attempt.id,
            message: "Quiz data saved to your existing account",
            quizAttemptId: attempt.id,
            storageType: "permanent",
            userType: "existing-unpaid",
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

        return (res as any).json({
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
      return (res as any).json({
        success: true,
        attemptId: anonymousAttempt.id,
        message: "Quiz data saved anonymously in database",
        quizAttemptId: anonymousAttempt.id,
        storageType: "anonymous-db",
        userType: "anonymous",
        sessionId: sessionKey,
        warning: "Your data is stored anonymously in our database and will be deleted after 24 hours unless you provide an email or pay."
      });
    } catch (error: any) {
      console.error("Error saving quiz data:", error);
      (res as any).status(500).json({
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

  // Link existing quiz attempts to new permanent user account
  (app as any).post("/api/link-quiz-attempts", async (req: any, res: any) => {
    try {
      const { email, userId } = (req.body as any);
      
      if (!email || !userId) {
        return (res as any).status(400).json({ error: "Email and userId are required" });
      }

      console.log(`Linking quiz attempts for email: ${email} to userId: ${userId}`);

      // Find all quiz attempts for this email (temporary users)
      const tempUser = await storage.getUserByEmail(email);
      
      if (tempUser && tempUser.isTemporary) {
        // Get all quiz attempts for the temporary user
        const tempAttempts = await storage.getQuizAttemptsByUserId(tempUser.id);
        
        console.log(`Found ${tempAttempts.length} quiz attempts to link for temporary user ${tempUser.id}`);
        
        // Link each attempt to the new permanent user
        for (const attempt of tempAttempts) {
          await storage.updateQuizAttempt(attempt.id, { userId: userId });
          console.log(`Linked quiz attempt ${attempt.id} to permanent user ${userId}`);
        }
        
        // Optionally, we could delete the temporary user here
        // await storage.deleteUser(tempUser.id);
        
        return (res as any).json({
          success: true,
          linkedAttempts: tempAttempts.length,
          message: `Successfully linked ${tempAttempts.length} quiz attempts to your account`
        });
      }
      
      return (res as any).json({
        success: true,
        linkedAttempts: 0,
        message: "No temporary quiz attempts found to link"
      });
      
    } catch (error: any) {
      console.error("Error linking quiz attempts:", error);
      (res as any).status(500).json({
        error: "Failed to link quiz attempts",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Check for existing quiz attempts by email
  (app as any).get("/api/check-existing-attempts/:email", async (req: any, res: any) => {
    try {
      const { email } = (req.params as any);
      
      if (!email) {
        return (res as any).status(400).json({ error: "Email is required" });
      }

      console.log(`Checking existing attempts for email: ${email}`);

      // Check for ANY user (paid or temporary) with this email
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser && existingUser.isPaid) {
        // Paid user
        const attempts = await storage.getQuizAttemptsByUserId(existingUser.id);
        return (res as any).json({
          hasAccount: true,
          userType: "paid",
          userId: existingUser.id,
          attemptsCount: attempts.length,
          latestAttempt: attempts.length > 0 ? attempts[0] : null,
          message: "You have a paid account. Please log in to access your results.",
        });
      }
      
      if (existingUser && !existingUser.isPaid) {
        // Non-paid user (regular account but not paid)
        const attempts = await storage.getQuizAttemptsByUserId(existingUser.id);
        return (res as any).json({
          hasAccount: true,
          userType: "unpaid",
          userId: existingUser.id,
          attemptsCount: attempts.length,
          latestAttempt: attempts.length > 0 ? attempts[0] : null,
          message: "You have an account but haven't purchased the full report yet. You can proceed to payment.",
        });
      }

      // No existing account
      return (res as any).json({
        hasAccount: false,
        userType: "new",
        message: "No existing account found for this email.",
      });

    } catch (error: any) {
      console.error("Error checking existing attempts:", error);
      (res as any).status(500).json({
        error: "Failed to check existing attempts",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });



  // Access pass concept removed - use report unlock payments instead

  // Get pricing for user without creating payment intent
  (app as any).get("/api/user-pricing/:userId", async (req: any, res: any) => {
    try {
      const { userId } = (req.params as any);

      if (!userId) {
        return (res as any).status(400).json({ error: "Missing userId" });
      }

      const pricingUser = await storage.getUser(parseInt(userId));
      if (!pricingUser) {
        return (res as any).status(404).json({ error: "User not found" });
      }
      // Determine pricing: $9.99 for new users, $4.99 for paid users
      const payments = await storage.getPaymentsByUser(parseInt(userId));
      let amountDollar;
      if (pricingUser.isPaid === true && !pricingUser.isTemporary) {
        // Paid users (converted from temporary) get $4.99 for subsequent quizzes
        amountDollar = "4.99";
      } else {
        // New users (temporary) pay $9.99 for first quiz
        amountDollar = "9.99";
      }

      (res as any).json({
        success: true,
        amount: amountDollar
      });
    } catch (error: any) {
      console.error("Error getting user pricing:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Create Stripe payment intent for report unlock
  (app as any).post(
    "/api/create-report-unlock-payment",
    async (req: any, res: any) => {
      try {
        let { userId, quizAttemptId, email, quizData } = (req.body as any);

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
              return (res as any).status(500).json({ 
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
                return (res as any).status(500).json({ error: "Failed to fetch existing user after unique constraint error" });
              }
            } else {
              console.error("Error creating temporary user for anonymous payment:", err);
              return (res as any).status(500).json({ error: "Failed to create or fetch temporary user", details: err.message });
            }
          }
          // Always link the quiz attempt to the user
          if (!tempUserObj) {
            console.error("No temporary user object available after storeTemporaryUser");
            return (res as any).status(500).json({ error: "No temporary user object available after storeTemporaryUser" });
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
            return (res as any).status(404).json({ 
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
              return (res as any).status(500).json({ 
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
          return (res as any).status(400).json({ error: "Missing or invalid quizAttemptId. Please retake the quiz or contact support." });
        }
        const parsedQuizAttemptId = parseInt(quizAttemptId.toString());

        console.log(`Parsed quiz attempt ID:`, parsedQuizAttemptId);
        
        // Direct database query to find the quiz attempt
        if (!db) {
          return (res as any).status(500).json({ error: "Database not available" });
        }
        
        console.log(`Looking for quiz attempt ${parsedQuizAttemptId} in database...`);
        const quizAttemptResult = await storage.getQuizAttempt(parsedQuizAttemptId);
        console.log(`Direct database query result:`, quizAttemptResult);
        
        if (!quizAttemptResult) {
          console.error(`Quiz attempt ${quizAttemptId} not found in database`);
          return (res as any).status(404).json({ 
            error: "Quiz attempt not found",
            details: `Quiz attempt ID ${quizAttemptId} does not exist`
          });
        }
        
        const quizAttempt = quizAttemptResult;
        console.log(`Found quiz attempt:`, quizAttempt);
        
        // Now find the user who created this quiz attempt
        if (!quizAttempt.userId) {
          return (res as any).status(400).json({ 
            error: "Quiz attempt has no associated user",
            details: "Cannot process payment for anonymous quiz attempt"
          });
        }
        
        console.log(`Looking for user ${quizAttempt.userId} who created the quiz attempt...`);
        const userResult = await storage.getUser(quizAttempt.userId);
        console.log(`User query result:`, userResult);
        
        if (!userResult) {
          console.error(`User ${quizAttempt.userId} not found for quiz attempt ${quizAttemptId}`);
          return (res as any).status(404).json({ 
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
          return (res as any).status(400).json({
            error: "Report is already unlocked for this quiz attempt"
          });
        }
        // Determine report unlock price based on user type
        let amount, amountDollar;
        if (finalUser.isPaid === true && !finalUser.isTemporary) {
          // Paid users (converted from temporary) get $4.99 for subsequent quizzes
          amount = 499;
          amountDollar = "4.99";
        } else {
          // New users (temporary) pay $9.99 for first quiz
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
          return (res as any).status(500).json({
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
            return (res as any).status(500).json({ error: 'Payment creation failed or returned undefined', details: payment });
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
          (res as any).json(paymentResponse);
        } catch (paymentError: any) {
          console.error("Error creating payment record:", paymentError);
          // If it's a foreign key constraint error, provide a more helpful message
          if (paymentError.message && paymentError.message.includes('foreign key constraint')) {
            console.error("Foreign key constraint error - quiz attempt may not exist");
            return (res as any).status(400).json({
              error: "Quiz attempt not found",
              details: `The quiz attempt (ID: ${quizAttemptId}) could not be found. Please try again or contact support.`
            });
          }
          return (res as any).status(500).json({ error: 'Payment creation failed', details: paymentError?.message || paymentError });
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.error('Unique constraint error (P2002) in payment endpoint:', error);
          // Try to fetch and return the existing user for debugging
          if ((req.body as any) && (req.body as any).email) {
            const user = await storage.prisma.user.findUnique({ where: { email: (req.body as any).email } });
            if (user) {
              return (res as any).status(409).json({ error: 'User with this email already exists', user });
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
        (res as any).status(500).json({ 
          error: "Internal server error",
          details: error?.message || "Unknown error"
        });
      }
    },
  );

  // Register payment status route first for debugging
  console.log('[DEBUG] Registering /api/payment-status/:paymentId route...');
  (app as any).get(
    "/api/payment-status/:paymentId",
    async (req: any, res: any) => {
      try {
        const { paymentId } = (req.params as any);
        const paymentIdInt = parseInt(paymentId);

        if (!paymentIdInt) {
          return (res as any).status(400).json({ error: "Invalid payment ID" });
        }

        // Get payment from database
        if (!db) {
          return (res as any).status(500).json({ error: "Database not available" });
        }
        
        const paymentResult = await storage.getPaymentById(paymentIdInt);
        
        if (!paymentResult) {
          return (res as any).status(404).json({ error: "Payment not found" });
        }

        const payment = paymentResult;

        // If it's a Stripe payment, check the payment intent status
        if (payment.stripePaymentIntentId && stripe) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
            return (res as any).json({
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
            return (res as any).json({
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
        (res as any).json({
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          type: payment.type,
          quizAttemptId: payment.quizAttemptId,
          paypalOrderId: payment.paypalOrderId,
          completedAt: payment.completedAt,
        });
      } catch (error: any) {
        console.error("Error getting payment status:", error);
        (res as any).status(500).json({ error: "Internal server error" });
      }
    },
  );
  console.log('[DEBUG] Registered /api/payment-status/:paymentId route.');

  // Get payment status by payment ID
  (app as any).get(
    "/api/payment-status/:paymentId",
    async (req: any, res: any) => {
      try {
        const { paymentId } = (req.params as any);
        const paymentIdInt = parseInt(paymentId);

        if (!paymentIdInt) {
          return (res as any).status(400).json({ error: "Invalid payment ID" });
        }

        // Get payment from database
        if (!db) {
          return (res as any).status(500).json({ error: "Database not available" });
        }
        
        const paymentResult = await db.select().from(payments).where(eq(payments.id, paymentIdInt));
        
        if (!paymentResult || paymentResult.length === 0) {
          return (res as any).status(404).json({ error: "Payment not found" });
        }

        const payment = paymentResult[0];

        // If it's a Stripe payment, check the payment intent status
        if (payment.stripePaymentIntentId && stripe) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
            return (res as any).json({
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
            return (res as any).json({
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
        (res as any).json({
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          type: payment.type,
          quizAttemptId: payment.quizAttemptId,
          paypalOrderId: payment.paypalOrderId,
          completedAt: payment.completedAt,
        });
      } catch (error: any) {
        console.error("Error getting payment status:", error);
        (res as any).status(500).json({ error: "Internal server error" });
      }
    },
  );

  // PayPal payment creation endpoint for report unlock
  (app as any).post(
    "/api/create-paypal-payment",
    async (req: any, res: any) => {
      try {
        // PayPal is now mocked (ignoring PayPal as requested)

        let { userId, quizAttemptId, email } = (req.body as any);

        console.log("PayPal endpoint called with:", { userId, quizAttemptId, email });

        // First, verify that the quiz attempt exists
        if (!quizAttemptId) {
          return (res as any).status(400).json({ error: "Missing quizAttemptId" });
        }

        const parsedQuizAttemptId = parseInt(quizAttemptId.toString());
        console.log(`Parsed quiz attempt ID:`, parsedQuizAttemptId);
        
        // Direct database query to find the quiz attempt
        if (!db) {
          return (res as any).status(500).json({ error: "Database not available" });
        }
        
        console.log(`Looking for quiz attempt ${parsedQuizAttemptId} in database...`);
        const quizAttemptResult = await storage.getQuizAttempt(parsedQuizAttemptId);
        console.log(`Direct database query result:`, quizAttemptResult);
        
        if (!quizAttemptResult) {
          console.error(`Quiz attempt ${quizAttemptId} not found in database`);
          return (res as any).status(404).json({ 
            error: "Quiz attempt not found",
            details: `Quiz attempt ID ${quizAttemptId} does not exist`
          });
        }
        
        const quizAttempt = quizAttemptResult;
        console.log(`Found quiz attempt:`, quizAttempt);
        
        // Now find the user who created this quiz attempt
        if (!quizAttempt.userId) {
          return (res as any).status(400).json({ 
            error: "Quiz attempt has no associated user",
            details: "Cannot process payment for anonymous quiz attempt"
          });
        }
        
        console.log(`Looking for user ${quizAttempt.userId} who created the quiz attempt...`);
        const userResult = await storage.getUser(quizAttempt.userId);
        console.log(`User query result:`, userResult);
        
        if (!userResult) {
          console.error(`User ${quizAttempt.userId} not found for quiz attempt ${quizAttemptId}`);
          return (res as any).status(404).json({ 
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
          return (res as any).status(400).json({
            error: "Report is already unlocked for this quiz attempt"
          });
        }

        // Determine report unlock price based on user type
        let amount, paypalAmount;
        if (user.isPaid === true && !user.isTemporary) {
          // Paid users (converted from temporary) get $4.99 for subsequent quizzes
          amount = 499;
          paypalAmount = "4.99";
        } else {
          // New users (temporary) pay $9.99 for first quiz
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

        // Mock PayPal order creation (ignoring PayPal as requested)
        const mockOrderId = 'mock-order-' + Date.now();
        console.log('Mock PayPal order created:', mockOrderId);

        // Create payment record directly in database
        const payment = await storage.createPayment({
          userId,
          amount: String(amount),
          currency: "usd",
          type: paymentType,
          status: "pending",
          quizAttemptId,
          paypalOrderId: mockOrderId,
          version: 1,
        });

        (res as any).json({
          success: true,
          orderID: mockOrderId,
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
          return (res as any).status(500).json({ 
            error: "PayPal authentication failed",
            details: "Please check PayPal credentials"
          });
        }
        
        if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
          return (res as any).status(500).json({ 
            error: "PayPal service temporarily unavailable",
            details: "Please try again later"
          });
        }
        
        (res as any).status(500).json({ 
          error: "PayPal payment creation failed",
          details: error?.message || "Unknown error"
        });
      }
    },
  );

  // PayPal payment capture endpoint (MOCK - ignoring PayPal as requested)
  (app as any).post(
    "/api/capture-paypal-payment",
    async (req: any, res: any) => {
      try {
        const { orderID, paymentID, payerID, quizAttemptId, email } = (req.body as any);
        
        if (!orderID || !paymentID || !payerID) {
          return (res as any).status(400).json({ error: 'PayPal payment details are required' });
        }

              // Mock successful PayPal capture
      console.log('Mock PayPal capture successful:', { orderID, paymentID, payerID, email });

      // Update payment status in database
      try {
        const payment = await storage.prisma.payment.findFirst({
          where: {
            paypalOrderId: orderID,
            status: 'pending'
          }
        });

        if (payment) {
          await storage.prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'completed',
              completedAt: new Date(),
              paypalCaptureId: 'mock-capture-' + Date.now()
            }
          });
        }
      } catch (dbError) {
        console.error('Error updating payment status:', dbError);
        // Continue with mock response even if DB update fails
      }

      (res as any).json({
        success: true,
        captureID: 'mock-capture-' + Date.now(),
        message: 'PayPal payment captured successfully (mock)'
      });
      } catch (error: any) {
        console.error('Mock PayPal capture error:', error);
        (res as any).status(500).json({ 
          error: 'Payment processing error',
          message: 'Please try again or contact support if the problem persists'
        });
      }
    },
  );

  // Stripe webhook endpoint
  (app as any).post("/api/stripe/webhook", async (req: any, res: any) => {
    const sig = (req.headers as any)["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Stripe webhook secret not configured");
      return (res as any).status(400).send("Webhook secret not configured");
    }

    let event: Stripe.Event;

    try {
      if (!stripe) {
        return (res as any).status(400).send("Payment processing not configured");
      }

      event = stripe.webhooks.constructEvent((req.body as any), sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return (res as any).status(400).send(`Webhook Error: ${err}`);
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
            } catch (error: any) {
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

      (res as any).json({ received: true });
    } catch (error: any) {
      console.error("Error processing webhook:", error);
      (res as any).status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Admin refund endpoints
  // Get all payments with optional pagination (admin only)
  (app as any).get("/api/admin/payments", requireAdminAuth, async (req: any, res: any) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      // Get query parameters for pagination and filtering
      const limit = Math.min(parseInt((req.query as any).limit as string) || 100, 1000); // Max 1000 records
      const offset = parseInt((req.query as any).offset as string) || 0;
      const status = (req.query as any).status as string;

      // Use optimized query that JOINs payments with users (fixes N+1 problem)
      const paymentsWithUsers = await storage.getPaymentsWithUsers({
        limit,
        offset,
        status,
      });

      (res as any).json({
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
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Convert temporary user to permanent (admin only - for development/testing)
  (app as any).post("/api/admin/convert-temp-user", requireAdminAuth, async (req: any, res: any) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      const { userId } = (req.body as any);

      if (!userId) {
        return (res as any).status(400).json({
          error: "User ID is required",
        });
      }

      // Get the user record
      const user = await storage.getUser(userId);

      if (!user) {
        return (res as any).status(404).json({ error: "User not found" });
      }

      if (!user.isTemporary) {
        return (res as any).status(400).json({ error: "User is already permanent" });
      }

      // Convert to permanent user by updating the database
      await storage.updateUser(userId, { isTemporary: false });

      console.log(`Admin converted temporary user ${userId} to permanent`);

      (res as any).json({
        success: true,
        message: "User converted to permanent successfully",
        userId: userId,
      });
    } catch (error: any) {
      console.error("Error converting temporary user:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Complete a payment (admin only - for development/testing)
  (app as any).post("/api/admin/complete-payment", requireAdminAuth, async (req: any, res: any) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      const { paymentId } = (req.body as any);

      if (!paymentId) {
        return (res as any).status(400).json({
          error: "Payment ID is required",
        });
      }

      // Get the payment record
      const payment = await storage.getPaymentById(paymentId);

      if (!payment) {
        return (res as any).status(404).json({ error: "Payment not found" });
      }

      if (payment.status === "completed") {
        return (res as any).status(400).json({ error: "Payment is already completed" });
      }

      // Complete the payment
      await storage.completePayment(paymentId);

      console.log(`Admin completed payment ${paymentId} for user ${payment.userId}`);

      (res as any).json({
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
    } catch (error: any) {
      console.error("Error completing payment:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Process a refund (admin only)
  (app as any).post("/api/admin/refund", requireAdminAuth, async (req: any, res: any) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      const { paymentId, amount, reason, adminNote } = (req.body as any);

      if (!paymentId || !amount || !reason) {
        return (res as any).status(400).json({
          error: "Payment ID, amount, and reason are required",
        });
      }

      // Get the payment record
      const payment = await storage.getPaymentById(paymentId);

      if (!payment) {
        return (res as any).status(404).json({ error: "Payment not found" });
      }

      // Check if payment is already fully refunded
      const existingRefunds = await storage.getRefundsByPayment(paymentId);
      const totalRefunded = existingRefunds
        .filter((r: any) => r.status === "succeeded")
        .reduce((sum: any, r: any) => sum + parseFloat(r.amount), 0);

      const paymentAmount = parseFloat(payment.amount);
      const requestedAmount = parseFloat(amount);

      if (totalRefunded + requestedAmount > paymentAmount) {
        return (res as any).status(400).json({
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
        adminUserId: (req as any).admin?.id || null,
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

        (res as any).json({
          success: true,
          refund,
          providerRefundId,
          message: `Refund of $${requestedAmount} processed successfully`,
        });
      } catch (providerError) {
        console.error("Provider refund error:", providerError);

        // Update refund status to failed
        await storage.updateRefundStatus(refund.id, "failed", new Date());

        (res as any).status(500).json({
          error: "Refund failed",
          details:
            providerError instanceof Error
              ? providerError.message
              : String(providerError),
          refundId: refund.id,
        });
      }
    } catch (error: any) {
      console.error("Error processing refund:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Get all refunds (admin only)
  (app as any).get("/api/admin/refunds", requireAdminAuth, async (req: any, res: any) => {
    try {
      // Admin authentication is handled by requireAdminAuth middleware

      // Get query parameters for pagination
      const limit = Math.min(parseInt((req.query as any).limit as string) || 100, 1000); // Max 1000 records
      const offset = parseInt((req.query as any).offset as string) || 0;

      const refunds = await storage.getAllRefunds(limit + offset);
      const paginatedRefunds = refunds.slice(offset, offset + limit);

      (res as any).json({
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
    } catch (error: any) {
      console.error("Error fetching refunds:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Clear business model AI content for new paid quiz attempts
  (app as any).post("/api/clear-business-model-ai-content", async (req: any, res: any) => {
    try {
      const { userId } = (req.body as any);

      if (!userId) {
        return (res as any).status(400).json({ error: "User ID is required" });
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
      
      (res as any).json({ 
        success: true, 
        message: `Cleared ${deletedCount} business model AI content entries`,
        deletedCount 
      });
    } catch (error: any) {
      console.error("Error clearing business model AI content:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // PDF report page endpoint (for Playwright to render)
  (app as any).get("/pdf-report", async (req: any, res: any) => {
    try {
      const dataParam = (req.query as any).data as string;
      if (!dataParam) {
        return (res as any).status(400).send("No data provided");
      }

      // Decode the base64 data
      let decodedData;
      let data;
      try {
        decodedData = Buffer.from(
          decodeURIComponent(dataParam).replace("data:application/json;base64,", ""),
          'base64'
        ).toString();
        data = JSON.parse(decodedData);
      } catch (decodeError) {
        console.error("PDF data decoding error:", decodeError);
        return (res as any).status(400).send("Invalid data format - unable to decode PDF data");
      }

      if (!data.quizData) {
        return (res as any).status(400).send("Invalid data format");
      }

      // Generate HTML for the PDF report
      const htmlContent = generatePDFReportHTML(data);
      
      res.setHeader('Content-Type', 'text/html');
      (res as any).send(htmlContent);
    } catch (error: any) {
      console.error("PDF report generation error:", error);
      (res as any).status(500).send("Failed to generate PDF report");
    }
  });

  // PDF generation endpoint - PAID FEATURE ONLY
  (app as any).post("/api/generate-pdf", async (req: any, res: any) => {
    console.log('[PDF DEBUG] /api/generate-pdf route handler called');
    try {
      // AUTHENTICATION CHECK - PDF generation requires login
      const userId = await getUserIdFromRequest(req);
      if (!userId) {
        return (res as any).status(401).json({ 
          error: "Authentication required",
          message: "You must create an account to generate PDF reports"
        });
      }

      const { quizData, userEmail, aiAnalysis, topBusinessPath, businessScores, quizAttemptId } = (req.body as any);

      console.log("PDF generation request received", {
        hasQuizData: !!quizData,
        hasAIAnalysis: !!aiAnalysis,
        hasTopBusinessPath: !!topBusinessPath,
        userEmail,
        userId,
        quizAttemptId,
      });

      if (!quizData) {
        return (res as any).status(400).json({ error: "Quiz data is required" });
      }

      // PAYMENT CHECK - Verify user has paid for this report
      if (quizAttemptId) {
        const hasPaid = await storage.hasUserPaidForReport(userId, parseInt(quizAttemptId.toString()));
        if (!hasPaid) {
          return (res as any).status(402).json({ 
            error: "Payment required",
            message: "You must purchase the report to generate PDF"
          });
        }
      }

      // Get the base URL from the request, fallback to current domain
      const baseUrl = (req.get as any)("host")?.includes("localhost")
        ? `${(req.protocol as any)}://${(req.get as any)("host")}`
        : "https://bizmodelai.com";
      console.log("Base URL:", baseUrl);

      const pdfBuffer = await pdfService.generatePDF({
        quizData,
        userEmail,
        aiAnalysis,
        topBusinessPath,
        businessScores,
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
      (res as any).send(pdfBuffer);
    } catch (error: any) {
      console.error("PDF generation failed:", error);
      (res as any).status(500).json({
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });


  // Check rate limit status for an email
  (app as any).post("/api/check-rate-limit", async (req: any, res: any) => {
    try {
      const { email } = (req.body as any);

      if (!email) {
        return (res as any).status(400).json({ error: "Missing email" });
      }

      // Check rate limit without actually sending an email
      const rateLimitCheck = await emailService.checkEmailRateLimitWithInfo(email);
      
      if (!rateLimitCheck.allowed) {
        (res as any).status(429).json({ 
          error: "Rate limit exceeded", 
          rateLimitInfo: rateLimitCheck.info 
        });
      } else {
        (res as any).json({ success: true, message: "No rate limit active" });
      }
    } catch (error: any) {
      console.error("Error checking rate limit:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Skills analysis endpoint removed - not used in frontend

  // Generate detailed "Why This Fits You" descriptions for top 3 business matches
  (app as any).post(
    "/api/generate-business-fit-descriptions",
    async (req: any, res: any) => {
      try {
        const { quizData, businessMatches } = (req.body as any);

        if (!quizData || !businessMatches || !Array.isArray(businessMatches)) {
          return (res as any).status(400).json({
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

        (res as any).json({ descriptions });
      } catch (error: any) {
        console.error("Error generating business fit descriptions:", error);

        // Return fallback descriptions
        const fallbackDescriptions = (req.body as any).businessMatches.map(
          (match: any, index: number) => ({
            businessId: match.id,
            description: `This business model aligns well with your ${(req.body as any).quizData.selfMotivationLevel >= 4 ? "high self-motivation" : "self-driven nature"} and ${(req.body as any).quizData.weeklyTimeCommitment} hours/week availability. Your ${(req.body as any).quizData.techSkillsRating >= 4 ? "strong" : "adequate"} technical skills and ${(req.body as any).quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance make this a ${index === 0 ? "perfect" : index === 1 ? "excellent" : "good"} match for your entrepreneurial journey.

${index === 0 ? "As your top match, this path offers the best alignment with your goals and preferences." : index === 1 ? "This represents a strong secondary option that complements your primary strengths." : "This provides a solid alternative path that matches your core capabilities."} Your ${(req.body as any).quizData.learningPreference?.replace("-", " ")} learning style and ${(req.body as any).quizData.workStructurePreference?.replace("-", " ")} work preference make this business model particularly suitable for your success.`,
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

        (res as any).json({ descriptions: fallbackDescriptions });
      }
    },
  );

  // Generate detailed "Why This Doesn't Fit Your Current Profile" descriptions for bottom 3 business matches
  (app as any).post(
    "/api/generate-business-avoid-descriptions",
    async (req: any, res: any) => {
      try {
        const { quizData, businessMatches } = (req.body as any);

        if (!quizData || !businessMatches || !Array.isArray(businessMatches)) {
          return (res as any).status(400).json({
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

        (res as any).json({ descriptions });
      } catch (error: any) {
        console.error("Error generating business avoid descriptions:", error);

        // Return fallback descriptions
        const fallbackDescriptions = (req.body as any).businessMatches.map(
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

        (res as any).json({ descriptions: fallbackDescriptions });
      }
    },
  );

  // AI Content Migration Endpoint
  (app as any).post(
    "/api/admin/migrate-ai-content",
    async (req: any, res: any) => {
      try {
        console.log(" Starting AI content migration...");

        let result = null;
        // Just call the migration method if it exists on storage
        if (typeof storage.migrateAIContentToNewTable === 'function') {
          result = await storage.migrateAIContentToNewTable();
        }

        console.log("AI content migration completed successfully");
        (res as any).json({
          success: true,
          message: "AI content migration completed",
          ...result,
        });
      } catch (error: any) {
        console.error("❌ AI content migration failed:", error);
        (res as any).status(500).json({
          success: false,
          error: "Migration failed",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  // Get stored email for unpaid users
  (app as any).get(
    "/api/get-stored-email/:sessionId",
    async (req: any, res: any) => {
      try {
        const { sessionId } = (req.params as any);
        const storedUser = await storage.getTemporaryUser(sessionId);

        if (storedUser) {
          (res as any).json({ email: storedUser.email });
        } else {
          (res as any).json({ email: null });
        }
      } catch (error: any) {
        console.error("Error getting stored email:", error);
        (res as any).status(500).json({ error: "Internal server error" });
      }
    },
  );

  // Get all collected emails endpoint for marketing/advertising
  (app as any).get("/api/admin/all-emails", async (req: any, res: any) => {
    try {
      console.log("Fetching all collected emails...");

      // Get emails from paid users (permanent storage)
      if (!db) {
        return (res as any).status(500).json({ error: "Database not available" });
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

      (res as any).json({
        success: true,
        totalEmails: emailList.length,
        emails: emailList,
        summary: {
          paidUsers: paidUsers.length,
          unpaidUsers: unpaidUsers.length,
          uniqueEmails: emailList.length,
        },
      });
    } catch (error: any) {
      console.error("Error fetching all emails:", error);
      (res as any).status(500).json({ error: "Failed to fetch emails" });
    }
  });

  // Send email endpoint for testing
  (app as any).post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html, quizAttemptId } = (req.body as any);
      if (!to || !subject || !html) {
        return (res as any).status(400).json({ success: false, error: "Missing to, subject, or html" });
      }
      const result = await emailService.sendEmail({ to, subject, html, quizAttemptId });
      console.log('[EMAIL DEBUG] /api/send-email result:', result);
      if (result.success) {
        (res as any).json({ success: true });
      } else if (result.rateLimitInfo) {
        (res as any).status(429).json({ success: false, error: "Rate limit exceeded", rateLimitInfo: result.rateLimitInfo });
      } else {
        (res as any).status(500).json({ success: false, error: result.error || "Failed to send email" });
      }
    } catch (error: any) {
      console.error("Error in /api/send-email:", error);
      (res as any).status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Send quiz results email
  (app as any).post("/api/send-quiz-results", async (req, res) => {
    try {
      const { email, quizData, attemptId } = (req.body as any);
      if (!email || !quizData) {
        return (res as any).status(400).json({ success: false, error: "Missing email or quiz data" });
      }

      console.log('[EMAIL DEBUG] Sending quiz results to:', email);
      
      // Check if user has paid for this specific report
      let hasPaidForReport = false;
      if (attemptId) {
        const attempt = await db.quizAttempt.findUnique({
          where: { id: attemptId },
          include: { user: true }
        });
        
        if (attempt?.user) {
          // Check if there's a successful payment for this specific quiz attempt
          const payment = await db.payment.findFirst({
            where: {
              userId: attempt.user.id,
              quizAttemptId: attemptId,
              status: 'completed'
            }
          });
          hasPaidForReport = !!payment;
        }
      }
      
      const result = await emailService.sendQuizResults(email, quizData, attemptId, hasPaidForReport);
      console.log('[EMAIL DEBUG] /api/send-quiz-results result:', result);
      
      if (result.success) {
        (res as any).json({ success: true, message: "Quiz results sent successfully" });
      } else if (result.rateLimitInfo) {
        (res as any).status(429).json({ 
          success: false, 
          error: "Rate limit exceeded", 
          rateLimitInfo: result.rateLimitInfo 
        });
      } else {
        (res as any).status(500).json({ success: false, error: "Failed to send quiz results" });
      }
    } catch (error: any) {
      console.error("Error in /api/send-quiz-results:", error);
      (res as any).status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Send full report email
  (app as any).post("/api/send-full-report", async (req, res) => {
    try {
      const { email, quizData, attemptId } = (req.body as any);
      if (!email || !quizData) {
        return (res as any).status(400).json({ success: false, error: "Missing email or quiz data" });
      }

      console.log('[EMAIL DEBUG] Sending full report to:', email);
      
      const result = await emailService.sendFullReport(email, quizData, attemptId);
      console.log('[EMAIL DEBUG] /api/send-full-report result:', result);
      
      if (result.success) {
        (res as any).json({ success: true, message: "Full report sent successfully" });
      } else if (result.rateLimitInfo) {
        (res as any).status(429).json({ 
          success: false, 
          error: "Rate limit exceeded", 
          rateLimitInfo: result.rateLimitInfo 
        });
      } else {
        (res as any).status(500).json({ success: false, error: "Failed to send full report" });
      }
    } catch (error: any) {
      console.error("Error in /api/send-full-report:", error);
      (res as any).status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get payment details by paymentId (for test/dev only)
  (app as any).get("/api/payment/:paymentId", async (req: any, res: any) => {
    try {
      const paymentId = parseInt((req.params as any).paymentId);
      if (!paymentId) {
        return (res as any).status(400).json({ error: "Invalid payment ID" });
      }
      const payment = await storage.getPaymentById(paymentId);
      if (!payment) {
        return (res as any).status(404).json({ error: "Payment not found" });
      }
      (res as any).json({ success: true, payment });
    } catch (error: any) {
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Contact form endpoint
  (app as any).post('/api/contact', async (req: any, res: any) => {
    try {
      const { name, email, message } = (req.body as any);
      
      if (!name || !email || !message) {
        return (res as any).status(400).json({ error: 'Name, email, and message are required' });
      }
      
      // Here you would typically send an email using your email service
      // For now, we'll just log the contact form submission
      console.log('Contact form submission:', { name, email, message });
      
      (res as any).json({ message: 'Contact form submitted successfully' });
    } catch (error: any) {
      console.error('Contact form error:', error);
      (res as any).status(500).json({ error: 'Internal server error' });
    }
  });

  // Quiz payment creation endpoint
  (app as any).post('/api/create-quiz-payment', async (req: any, res: any) => {
    try {
      const { quizAttemptId, email, paymentMethod } = (req.body as any);
      
      if (!quizAttemptId || !email) {
        return (res as any).status(400).json({ error: 'Quiz attempt ID and email are required' });
      }

      // Find the quiz attempt
      const attempt = await storage.getQuizAttempt(parseInt(quizAttemptId));
      if (!attempt) {
        return (res as any).status(404).json({ error: 'Quiz attempt not found' });
      }

      // Create or find user
      let user = await storage.getUserByEmail(email);
      if (!user) {
        // Create temporary user
        const sessionKey = getSessionKey(req);
        user = await storage.storeTemporaryUser(sessionKey, email, {
          quizData: attempt.quizData,
          password: "temp-" + Math.random().toString(36).substring(2)
        });
      }

      // Link quiz attempt to user
      await storage.updateQuizAttempt(attempt.id, { userId: user.id });

      // Create payment record using storage abstraction
      const payment = await storage.createPayment({
        userId: user.id,
        quizAttemptId: attempt.id,
        amount: "19.99",
        currency: 'usd',
        type: 'quiz_payment',
        status: 'pending'
      });

      (res as any).json({
        success: true,
        paymentId: payment.id,
        userId: user.id,
        quizAttemptId: attempt.id
      });
    } catch (error: any) {
      console.error('Create quiz payment error:', error);
      (res as any).status(500).json({ error: 'Failed to create quiz payment' });
    }
  });

  // Access pass payment creation endpoint
  (app as any).post('/api/create-access-pass-payment', async (req: any, res: any) => {
    try {
      const { userId, paymentMethod } = (req.body as any);
      
      if (!userId) {
        return (res as any).status(400).json({ error: 'User ID is required' });
      }

      // Verify user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return (res as any).status(404).json({ error: 'User not found' });
      }

      // Create payment record for access pass using storage abstraction
      const payment = await storage.createPayment({
        userId: parseInt(userId),
        amount: "29.99",
        currency: 'usd',
        type: 'access_pass',
        status: 'pending'
      });

      (res as any).json({
        success: true,
        paymentId: payment.id,
        userId: parseInt(userId)
      });
    } catch (error: any) {
      console.error('Create access pass payment error:', error);
      (res as any).status(500).json({ error: 'Failed to create access pass payment' });
    }
  });

  (app as any).post('/api/create-report-unlock-payment', async (req: any, res: any) => {
    try {
      const { userId, quizAttemptId, email, quizData } = (req.body as any);
      
      if (!email) {
        return (res as any).status(400).json({ error: 'Email is required' });
      }

      let finalUserId = userId;
      let finalQuizAttemptId = quizAttemptId;

      // Handle different user scenarios
      if (userId) {
        // Authenticated user
        const user = await storage.getUser(userId);
        if (!user) {
          return (res as any).status(404).json({ error: 'User not found' });
        }
        if (!user.isTemporary) {
          // Fully authenticated user
          finalUserId = user.id;
        } else {
          // Temporary user - treat as guest
          finalUserId = user.id;
        }
      } else {
        // Guest user or temporary user
        let user = await storage.getUserByEmail(email);
        
        if (!user) {
          // Create temporary user
          const sessionKey = getSessionKey(req);
          user = await storage.storeTemporaryUser(sessionKey, email, {
            quizData: quizData || {},
            password: "temp-" + Math.random().toString(36).substring(2)
          });
        }
        
        finalUserId = user.id;

        // Create or link quiz attempt
        if (quizAttemptId) {
          // Link existing quiz attempt to user
          await storage.updateQuizAttempt(quizAttemptId, { userId: user.id });
          finalQuizAttemptId = quizAttemptId;
        } else if (quizData) {
          // Create new quiz attempt for user
          const attempt = await storage.recordQuizAttempt({
            userId: user.id,
            quizData
          });
          finalQuizAttemptId = attempt.id;
        }
      }

      // Create Stripe payment intent (mock for now)
      const clientSecret = 'pi_mock_secret_' + Date.now();

      // Create payment record
      const payment = await storage.prisma.payment.create({
        data: {
          userId: finalUserId,
          quizAttemptId: finalQuizAttemptId,
          amount: 19.99,
          currency: 'usd',
          type: 'report_unlock',
          status: 'pending',
          stripePaymentIntentId: clientSecret
        }
      });

      (res as any).json({
        success: true,
        clientSecret,
        paymentId: payment.id,
        userId: finalUserId,
        quizAttemptId: finalQuizAttemptId
      });
    } catch (error: any) {
      console.error('Create report unlock payment error:', error);
      (res as any).status(500).json({ error: 'Failed to create report unlock payment' });
    }
  });

  (app as any).post('/api/capture-paypal-payment', async (req: any, res: any) => {
    try {
      const { orderID, paymentID, payerID, quizAttemptId, email } = (req.body as any);
      
      if (!orderID || !paymentID || !payerID) {
        return (res as any).status(400).json({ error: 'PayPal payment details are required' });
      }

      // For now, just return success without database operations
      // This can be enhanced later with proper payment processing
      (res as any).json({
        success: true,
        paymentId: 'mock-payment-' + Date.now(),
        userId: null,
        quizAttemptId: quizAttemptId,
        message: 'Payment captured successfully (mock)'
      });
    } catch (error: any) {
      console.error('Capture PayPal payment error:', error);
      (res as any).status(500).json({ 
        error: 'Payment processing error',
        message: 'Please try again or contact support if the problem persists'
      });
    }
  });

  // Missing routes that frontend expects
  (app as any).get('/api/ai-insights', async (req: any, res: any) => {
    try {
      const userId = getUserIdFromRequest(req);
      if (!userId) {
        return (res as any).status(401).json({ error: 'Authentication required' });
      }

      // Get AI insights for the user
      const insights = await storage.prisma.aiContent.findMany({
        where: {
          quizAttempt: {
            userId: userId
          }
        },
        orderBy: { generatedAt: 'desc' },
        take: 10
      });

      (res as any).json({ insights });
    } catch (error: any) {
      console.error('Get AI insights error:', error);
      (res as any).status(500).json({ error: 'Failed to get AI insights' });
    }
  });

  (app as any).get('/api/business-resources/:businessModel', async (req: any, res: any) => {
    try {
      const { businessModel } = (req.params as any);
      
      // Mock business resources for now
      const resources = {
        "affiliate-marketing": {
          title: "Affiliate Marketing Resources",
          resources: [
            { name: "Amazon Associates", url: "https://affiliate-program.amazon.com/" },
            { name: "Commission Junction", url: "https://www.cj.com/" },
            { name: "ShareASale", url: "https://www.shareasale.com/" }
          ]
        },
        "e-commerce": {
          title: "E-commerce Resources",
          resources: [
            { name: "Shopify", url: "https://www.shopify.com/" },
            { name: "WooCommerce", url: "https://woocommerce.com/" },
            { name: "BigCommerce", url: "https://www.bigcommerce.com/" }
          ]
        }
      };

      const modelResources = resources[businessModel as keyof typeof resources] || {
        title: "General Business Resources",
        resources: [
          { name: "Small Business Administration", url: "https://www.sba.gov/" },
          { name: "SCORE", url: "https://www.score.org/" }
        ]
      };

      (res as any).json(modelResources);
    } catch (error: any) {
      console.error('Get business resources error:', error);
      (res as any).status(500).json({ error: 'Failed to get business resources' });
    }
  });

  (app as any).get('/api/email-link/:attemptId/:email', async (req: any, res: any) => {
    try {
      const { attemptId, email } = (req.params as any);
      
      if (!attemptId || !email) {
        return (res as any).status(400).json({ error: 'Attempt ID and email are required' });
      }

      // Generate email link (mock implementation)
      const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/results?attempt=${attemptId}&email=${encodeURIComponent(email)}`;
      
      (res as any).json({ link });
    } catch (error: any) {
      console.error('Generate email link error:', error);
      (res as any).status(500).json({ error: 'Failed to generate email link' });
    }
  });

  // TEST-ONLY: Mark a user as paid by email (development only)
  if (process.env.NODE_ENV === 'development') {
    (app as any).post('/api/admin/mark-user-paid', async (req: any, res: any) => {
      try {
        const { email } = (req.body as any);
        if (!email) {
          return (res as any).status(400).json({ error: 'Email is required' });
        }
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return (res as any).status(404).json({ error: 'User not found' });
        }
        await storage.makeUserPaidAndRemoveQuizExpiration(user.id);
        (res as any).json({ success: true, userId: user.id });
      } catch (error: any) {
        (res as any).status(500).json({ error: 'Failed to mark user as paid', details: error?.message });
      }
    });
  }

  // --- TEST-ONLY ENDPOINTS (development only) ---
  if (process.env.NODE_ENV !== 'production') {
    // Create or update a user with isPaid=true
    (app as any).post('/api/test-setup-user', async (req, res) => {
      const { email, password } = (req.body as any);
      if (!email || !password) return (res as any).status(400).json({ error: 'Missing email or password' });
      try {
        const bcrypt = await import('bcryptjs');
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
        (res as any).json({ success: true, user });
      } catch (err) {
        (res as any).status(500).json({ error: err.message });
      }
    });

    // Create or update a paid quiz attempt for the user
    (app as any).post('/api/test-setup-quiz-attempt', async (req, res) => {
      const { email, isPaid } = (req.body as any);
      if (!email) return (res as any).status(400).json({ error: 'Missing email' });
      try {
        const user = await storage.prisma.user.findUnique({ where: { email } });
        if (!user) return (res as any).status(404).json({ error: 'User not found' });
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
        (res as any).json({ success: true, attempt });
      } catch (err) {
        (res as any).status(500).json({ error: err.message });
      }
    });
  }
}
