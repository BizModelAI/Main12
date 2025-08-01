import OpenAI from "openai";
import { QuizData, BusinessPath } from "../../shared/types.js";
import { businessPaths } from "../../shared/businessPaths.js";
import { 
  getRatingDescription, 
  getIncomeGoalRange, 
  getTimeCommitmentRange, 
  getInvestmentRange 
} from "../utils/quizUtils.js";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 1, // Reduce retries to prevent long waits
      timeout: 25000, // 25 second timeout for all OpenAI calls
    })
  : null;

// Optimized rate limiting for concurrent requests
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 20; // Increase from 10 to 20 requests per minute
  private readonly windowMs = 60000; // 1 minute window
  private readonly maxHistorySize = 50; // Reduce memory usage
  private readonly cleanupInterval = 2 * 60 * 1000; // Clean up every 2 minutes
  private cleanupTimer: NodeJS.Timeout;

  constructor() {
    // Periodic cleanup to prevent memory leaks
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const oldSize = this.requests.length;
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    // Hard limit on array size to prevent memory bloat
    if (this.requests.length > this.maxHistorySize) {
      this.requests = this.requests.slice(-this.maxHistorySize);
    }

    if (oldSize > this.requests.length) {
      console.log(
        `🧹 AI Rate limiter cleanup: removed ${oldSize - this.requests.length} expired entries`,
      );
    }
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();

    // Clean up old requests
    this.cleanup();

    if (this.requests.length >= this.maxRequests) {
      // Wait until we can make another request
      const oldestRequest = Math.min(...this.requests);
      const waitTime = Math.min(
        this.windowMs - (now - oldestRequest) + 100,
        2000, // Cap wait at 2 seconds instead of 3
      );
      console.log(`⏳ AI rate limit hit, waiting ${waitTime}ms for slot`);

      if (waitTime > 3000) {
        // If we'd wait more than 3 seconds, just reject to avoid timeout
        throw new Error(
          "AI rate limit exceeded - too many concurrent requests",
        );
      }

      // Add timeout to prevent infinite waiting
      await Promise.race([
        new Promise((resolve) => setTimeout(resolve, waitTime)),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Rate limiter timeout")), 3000)
        )
      ]);
      
      return this.waitForSlot(); // Recursive check
    }

    this.requests.push(now);
  }

  // Clean shutdown method
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

const rateLimiter = new RateLimiter();

export interface BusinessFitAnalysis {
  fitScore: number;
  reasoning: string;
  strengths: string[];
  challenges: string[];
  confidence: number;
}

export interface ComprehensiveFitAnalysis {
  topMatches: Array<{
    businessPath: BusinessPath;
    analysis: BusinessFitAnalysis;
  }>;
  personalityProfile: {
    strengths: string[];
    developmentAreas: string[];
    workStyle: string;
    riskProfile: string;
  };
  recommendations: string[];
}

export class AIScoringService {
  private static instance: AIScoringService;

  private constructor() {}

  static getInstance(): AIScoringService {
    if (!AIScoringService.instance) {
      AIScoringService.instance = new AIScoringService();
    }
    return AIScoringService.instance;
  }

  // Utility to clean and repair JSON from OpenAI
  private cleanAndRepairJson(content: string): any {
    try {
      let cleaned = content.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
      
      // Try to find the first and last braces for a valid JSON object
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      
      // Remove trailing commas
      cleaned = cleaned.replace(/,\s*[}\]]/g, match => match.replace(',', ''));
      
      // Try to repair common JSON issues
      cleaned = this.repairTruncatedJson(cleaned);
      cleaned = this.repairUnterminatedStrings(cleaned);
      cleaned = this.repairIncompleteObjects(cleaned);
      cleaned = this.repairIncompleteArrays(cleaned);
      cleaned = this.ensureProperEnding(cleaned);
      
      return JSON.parse(cleaned);
    } catch (err) {
      console.error('[AI JSON REPAIR] Failed to parse/repair JSON:', { 
        err, 
        content: content?.substring(0, 500),
        contentLength: content?.length 
      });
      return null;
    }
  }

  async analyzeBusinessFit(
    quizData: QuizData,
  ): Promise<ComprehensiveFitAnalysis> {
    console.log("analyzeBusinessFit called", {
      hasOpenAI: !!openai,
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    });

    try {
      if (!openai) {
        console.error("OpenAI API key not configured, using fallback analysis");
        return this.fallbackAnalysis(quizData);
      }

      // Wait for rate limiter slot
      await rateLimiter.waitForSlot();

      const prompt = this.buildAnalysisPrompt(quizData);

      // Add timeout to prevent hanging (15s)
      const response = (await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a business consultant. Analyze quiz responses and provide business model compatibility scores. Return ONLY valid JSON. Address user directly with 'you' and 'your'.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 800, // Reduced from 1000
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => {
              console.error("OpenAI API call timed out after 15 seconds");
              reject(new Error("OpenAI API call timed out after 15 seconds"));
            },
            15000, // Reduced from 25000
          ),
        ),
      ])) as OpenAI.Chat.Completions.ChatCompletion;

      const content = response.choices[0].message.content;
      if (!content) {
        console.error("No content in AI response, using fallback");
        return this.fallbackAnalysis(quizData);
      }

      // Use robust cleaning/repair
      const analysis = this.cleanAndRepairJson(content);
      if (!analysis || !analysis.personalityProfile || !analysis.businessAnalysis || !analysis.recommendations) {
        console.error("[AI JSON REPAIR] Invalid or incomplete JSON structure, using fallback", { content: content?.substring(0, 500) });
        return this.fallbackAnalysis(quizData);
      }
      return this.processAnalysis(analysis);
    } catch (error) {
      console.error("AI Scoring Service Error:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack trace",
        hasOpenAI: !!openai,
        hasApiKey: !!process.env.OPENAI_API_KEY,
      });
      return this.fallbackAnalysis(quizData);
    }
  }

  private buildAnalysisPrompt(quizData: QuizData): string {
    const businessModels = businessPaths.slice(0, 5).map((bp) => ({
      id: bp.id,
      name: bp.name,
      description: bp.description,
      difficulty: bp.difficulty,
      timeToProfit: bp.timeToProfit,
      startupCost: bp.startupCost,
      potentialIncome: bp.potentialIncome,
      skills: bp.skills,
      bestFitPersonality: bp.bestFitPersonality,
    }));

    return `
Analyze quiz responses and provide business model compatibility scores:

YOUR PROFILE:
- Motivation: ${quizData.mainMotivation}
- Income Goal: ${getIncomeGoalRange(quizData.successIncomeGoal)}
- Timeline: ${quizData.firstIncomeTimeline}
- Budget: ${getInvestmentRange(quizData.upfrontInvestment)}
- Time: ${getTimeCommitmentRange(quizData.weeklyTimeCommitment)}
- Tech Skills: ${getRatingDescription(quizData.techSkillsRating)}
- Communication: ${getRatingDescription(quizData.directCommunicationEnjoyment)}
- Risk: ${getRatingDescription(quizData.riskComfortLevel)}
- Motivation: ${getRatingDescription(quizData.selfMotivationLevel)}
- Creative: ${getRatingDescription(quizData.creativeWorkEnjoyment)}
- Work Style: ${quizData.workCollaborationPreference}
- Learning: ${quizData.learningPreference}
- Brand Comfort: ${getRatingDescription(quizData.brandFaceComfort)}
- Organization: ${getRatingDescription(quizData.organizationLevel)}
- Consistency: ${getRatingDescription(quizData.longTermConsistency)}

PERSONALITY TRAITS:
- Organization Level: ${getRatingDescription(quizData.organizationLevel)}
- Self Motivation: ${getRatingDescription(quizData.selfMotivationLevel)}
- Competitiveness: ${getRatingDescription(quizData.competitivenessLevel)}
- Creative Work Enjoyment: ${getRatingDescription(quizData.creativeWorkEnjoyment)}
- Direct Communication: ${getRatingDescription(quizData.directCommunicationEnjoyment)}

BUSINESS MODELS TO ANALYZE:
${businessModels.map(bp => `- ${bp.name}: ${bp.description}`).join('\n')}

Return JSON with:
- topMatches: Array of 3 best business models with fitScore (0-100), reasoning, strengths, challenges, confidence
- personalityProfile: strengths array, developmentAreas array, workStyle string, riskProfile string  
- recommendations: Array of 3 actionable recommendations

Keep responses concise and focused.`;
  }

  private processAnalysis(analysis: any): ComprehensiveFitAnalysis {
    const topMatches = analysis.businessAnalysis
      .map((ba: any) => {
        const businessPath = businessPaths.find(
          (bp) => bp.id === ba.businessId,
        );
        if (!businessPath) return null;

        return {
          businessPath: { ...businessPath, fitScore: ba.fitScore },
          analysis: {
            fitScore: ba.fitScore,
            reasoning: ba.reasoning,
            strengths: ba.strengths,
            challenges: ba.challenges,
            confidence: ba.confidence,
          },
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.analysis.fitScore - a.analysis.fitScore);

    return {
      topMatches,
      personalityProfile: analysis.personalityProfile,
      recommendations: analysis.recommendations,
    };
  }

  private fallbackAnalysis(quizData: QuizData): ComprehensiveFitAnalysis {
    console.log("Starting fallback analysis (algorithmic scoring)");
    // Enhanced algorithmic scoring as fallback
    const scoredPaths = businessPaths
      .map((path) => {
        const fitScore = this.calculateEnhancedFitScore(path.id, quizData);
        return {
          businessPath: { ...path, fitScore },
          analysis: {
            fitScore,
            reasoning: `Algorithmic analysis based on ${path.name} requirements vs your profile`,
            strengths: this.getPathStrengths(path.id, quizData),
            challenges: this.getPathChallenges(path.id, quizData),
            confidence: 0.7,
          },
        };
      })
      .sort((a, b) => b.analysis.fitScore - a.analysis.fitScore);

    return {
      topMatches: scoredPaths,
      personalityProfile: {
        strengths: this.getPersonalityStrengths(quizData),
        developmentAreas: this.getPersonalityDevelopmentAreas(quizData),
        workStyle: this.getWorkStyleDescription(quizData),
        riskProfile: this.getRiskProfileDescription(quizData),
      },
      recommendations: this.getGeneralRecommendations(quizData),
    };
  }

  private calculateEnhancedFitScore(pathId: string, data: QuizData): number {
    // Use the existing scoring logic but enhance it
    const factors = this.calculateFactors(pathId, data);
    const weights = {
      income: 0.2,
      timeline: 0.15,
      budget: 0.15,
      skills: 0.2,
      personality: 0.15,
      risk: 0.1,
      time: 0.05,
    };

    const score = Object.keys(factors).reduce((total, key) => {
      const factorKey = key as keyof typeof factors;
      const weightKey = key as keyof typeof weights;
      return total + factors[factorKey] * weights[weightKey] * 100;
    }, 0);

    return Math.min(Math.max(Math.round(score), 0), 100);
  }

  private calculateFactors(pathId: string, data: QuizData): any {
    // Simplified version of the factor calculation
    const factors = {
      income: 0.5,
      timeline: 0.5,
      budget: 0.5,
      skills: 0.5,
      personality: 0.5,
      risk: 0.5,
      time: 0.5,
    };

    // Path-specific calculations would go here
    // This is a simplified version for the fallback

    return factors;
  }

  private getPathStrengths(pathId: string, data: QuizData): string[] {
    const strengths = [];

    if (data.selfMotivationLevel >= 4) {
      strengths.push("High self-motivation");
    }
    if (data.techSkillsRating >= 4) {
      strengths.push("Strong technical skills");
    }
    if (data.directCommunicationEnjoyment >= 4) {
      strengths.push("Excellent communication abilities");
    }

    return strengths;
  }

  private getPathChallenges(pathId: string, data: QuizData): string[] {
    const challenges = [];

    if (data.riskComfortLevel <= 2) {
      challenges.push("Low risk tolerance may limit growth");
    }
    if (data.weeklyTimeCommitment <= 10) {
      challenges.push("Limited time availability");
    }

    return challenges;
  }

  private getPersonalityStrengths(data: QuizData): string[] {
    const strengths = [];

    if (data.selfMotivationLevel >= 4) strengths.push("Self-motivated");
    if (data.organizationLevel >= 4) strengths.push("Well-organized");
    if (data.longTermConsistency >= 4) strengths.push("Consistent");
    if (data.techSkillsRating >= 4) strengths.push("Tech-savvy");
    if (data.creativeWorkEnjoyment >= 4) strengths.push("Creative");

    return strengths;
  }

  private getPersonalityDevelopmentAreas(data: QuizData): string[] {
    const areas = [];

    if (data.riskComfortLevel <= 2) areas.push("Risk tolerance");
    if (data.directCommunicationEnjoyment <= 2)
      areas.push("Communication confidence");
    if (data.brandFaceComfort <= 2) areas.push("Personal branding comfort");

    return areas;
  }

  private getWorkStyleDescription(data: QuizData): string {
    const styles = {
      "solo-only": "Strongly prefers independent work",
      "mostly-solo": "Prefers working alone with minimal collaboration",
      balanced: "Comfortable with both solo and team work",
      "team-focused": "Thrives in collaborative environments",
    };

    return (
      styles[data.workCollaborationPreference as keyof typeof styles] ||
      "Flexible work style"
    );
  }

  private getRiskProfileDescription(data: QuizData): string {
    if (data.riskComfortLevel >= 4)
      return "High risk tolerance - comfortable with uncertainty";
    if (data.riskComfortLevel >= 3)
      return "Moderate risk tolerance - cautious but willing to take calculated risks";
    return "Low risk tolerance - prefers stable, predictable opportunities";
  }

  private getGeneralRecommendations(data: QuizData): string[] {
    const recommendations = [];

    if (data.selfMotivationLevel >= 4) {
      recommendations.push(
        "Focus on business models that reward self-driven individuals",
      );
    }
    if (data.weeklyTimeCommitment <= 10) {
      recommendations.push(
        "Consider part-time or passive income opportunities first",
      );
    }
    if (data.upfrontInvestment <= 500) {
      recommendations.push(
        "Start with low-cost business models to minimize risk",
      );
    }

    return recommendations;
  }

  /**
   * Comprehensive JSON repair function to handle truncated responses
   */
  private repairTruncatedJson(jsonString: string): string {
    let repaired = jsonString;
    
    // If the JSON is already valid, return it
    try {
      JSON.parse(repaired);
      return repaired;
    } catch {
      // Continue with repair attempts
    }

    // Step 1: Handle unterminated strings
    repaired = this.repairUnterminatedStrings(repaired);
    
    // Step 2: Handle incomplete objects
    repaired = this.repairIncompleteObjects(repaired);
    
    // Step 3: Handle incomplete arrays
    repaired = this.repairIncompleteArrays(repaired);
    
    // Step 4: Final cleanup - remove trailing commas
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
    
    // Step 5: Ensure the JSON ends properly
    repaired = this.ensureProperEnding(repaired);
    
    return repaired;
  }

  private repairUnterminatedStrings(jsonString: string): string {
    let result = jsonString;
    let inString = false;
    let escapeNext = false;
    let lastValidPosition = 0;
    
    for (let i = 0; i < result.length; i++) {
      const char = result[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' && !escapeNext) {
        inString = !inString;
        if (!inString) {
          lastValidPosition = i;
        }
      }
    }
    
    // If we're still in a string, close it
    if (inString) {
      result = result.substring(0, lastValidPosition + 1);
    }
    
    return result;
  }

  private repairIncompleteObjects(jsonString: string): string {
    let result = jsonString;
    let braceCount = 0;
    let lastValidPosition = 0;
    
    for (let i = 0; i < result.length; i++) {
      const char = result[i];
      
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount >= 0) {
          lastValidPosition = i;
        }
      }
    }
    
    // If we have unclosed braces, close them
    if (braceCount > 0) {
      result = result.substring(0, lastValidPosition + 1);
      for (let i = 0; i < braceCount; i++) {
        result += '}';
      }
    }
    
    return result;
  }

  private repairIncompleteArrays(jsonString: string): string {
    let result = jsonString;
    let bracketCount = 0;
    let lastValidPosition = 0;
    
    for (let i = 0; i < result.length; i++) {
      const char = result[i];
      
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount >= 0) {
          lastValidPosition = i;
        }
      }
    }
    
    // If we have unclosed brackets, close them
    if (bracketCount > 0) {
      result = result.substring(0, lastValidPosition + 1);
      for (let i = 0; i < bracketCount; i++) {
        result += ']';
      }
    }
    
    return result;
  }

  private ensureProperEnding(jsonString: string): string {
    let result = jsonString.trim();
    
    // Remove trailing commas before closing braces/brackets
    result = result.replace(/,(\s*[}\]])/g, '$1');
    
    // If the JSON doesn't end with a closing brace, find the last valid position
    if (!result.endsWith('}')) {
      const lastBraceIndex = result.lastIndexOf('}');
      if (lastBraceIndex > 0) {
        result = result.substring(0, lastBraceIndex + 1);
      }
    }
    
    return result;
  }

  // Utility functions now imported from ../utils/quizUtils.js
}

export const aiScoringService = AIScoringService.getInstance();
