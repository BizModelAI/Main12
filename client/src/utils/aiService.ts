import { QuizData, BusinessPath, AIAnalysis } from "../types";
import { AICacheManager } from "./aiCacheManager";
import { API_CONFIG } from "./apiConfig";

// Optimized AI Service with 3 clean calls structure
export class AIService {
  private static instance: AIService;
  private cache = new Map<string, any>();

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Enhanced method to check if we should generate AI content
  async shouldGenerateAIContent(
    contentType: string,
    quizData: QuizData,
    quizAttemptId?: string | null,
    topBusinessModelName?: string
  ): Promise<{
    shouldGenerate: boolean;
    reason: string;
    existingContent?: any;
  }> {
    // Create a cache key that includes the business model name for preview content
    const cacheKey = contentType === "preview" && topBusinessModelName 
      ? `${contentType}_${topBusinessModelName.replace(/\s+/g, '_')}`
      : contentType;

    console.log(`🔍 Checking if should generate ${cacheKey} AI content...`);

    // 1. Check if we have all required data
    if (!quizData) {
      console.log(`❌ No quiz data available - using fallback for ${cacheKey}`);
      return {
        shouldGenerate: false,
        reason: "No quiz data available"
      };
    }

    // 2. Check if we have a quiz attempt ID (means data is saved in database)
    // REMOVE this check for preview content only
    if (contentType !== 'preview' && !quizAttemptId) {
      console.log(`❌ No quiz attempt ID - quiz data not saved to database yet`);
      return {
        shouldGenerate: false,
        reason: "Quiz data not saved to database"
      };
    }

    // 3. Check if content already exists in database
    try {
      const existingContent = await this.getAIContentFromDatabase(quizAttemptId || null, cacheKey);
      if (existingContent) {
        console.log(`✅ Existing ${cacheKey} content found in database - using cached content`);
        return {
          shouldGenerate: false,
          reason: "Content already exists in database",
          existingContent
        };
      }
    } catch (error) {
      console.log(`⚠️ Error checking database for ${cacheKey}:`, error);
      // Continue to check localStorage as fallback
    }

    // 4. Check if content exists in localStorage (for anonymous users or fallback)
    // All localStorage fallback, migration, and compatibility logic for AI content has been removed. Only use database (Prisma-backed API) for AI content persistence and retrieval.

    // 5. Check if user is authenticated (for database storage)
    const isAuthenticated = await this.isUserAuthenticated();
    if (!isAuthenticated) {
      console.log(`⚠️ User not authenticated - will use database for ${cacheKey}`);
    }

    // 6. All checks passed - should generate new content
    console.log(`✅ Should generate new ${cacheKey} AI content`);
    return {
      shouldGenerate: true,
      reason: "No existing content found, generating new content"
    };
  }

  // Helper method to check if user is authenticated
  private async isUserAuthenticated(): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        return data.authenticated || !!data.id;
      }
      return false;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  // Enhanced method to get AI content from database
  private async getAIContentFromDatabase(
    quizAttemptId: string | null,
    contentType: string
  ): Promise<any | null> {
    if (!quizAttemptId) {
      return null;
    }
    try {
      const response = await fetch(
        `/api/quiz-attempts/attempt/${quizAttemptId}/ai-content?type=${contentType}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const responseText = await response.text();

        // Check if we got HTML instead of JSON (API endpoint not found)
        if (responseText.includes('<!doctype') || responseText.includes('<html')) {
          console.warn(`API returned HTML instead of JSON for ${contentType}. Endpoint may not exist.`);
          return null;
        }

        try {
          const data = JSON.parse(responseText);
          if (data.content || data.aiContent) {
            console.log(`✅ Retrieved ${contentType} from database for attempt ${quizAttemptId}`);
            return data.content || data.aiContent;
          }
        } catch (parseError) {
          console.error(`Failed to parse response for ${contentType}:`, responseText);
          return null;
        }
      } else {
        console.log(`No existing ${contentType} found in database (${response.status})`);
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${contentType} from database:`, error);
      return null;
    }
  }  



  // Method to clear cache and force fresh responses
  static clearCacheAndReset(): void {
    if (typeof window !== "undefined") {
      const aiCacheManager = AICacheManager.getInstance();
      aiCacheManager.forceResetCache();
      console.log(
        "AI cache cleared - next responses will be fresh from OpenAI",
      );
      // Force a page reload to ensure complete reset
      window.location.reload();
    }
  }

  // OPTIMIZED: Lean user profile compression with only essential fields
  private createUserProfile(
    quizData: QuizData,
    topMatch?: BusinessPath,
  ): string {
    // Helper function to convert numerical ratings to descriptive text
    const getRatingDescription = (rating: number): string => {
      if (rating >= 4) return "high";
      if (rating >= 3) return "moderate";
      return "low";
    };

    return `
User Profile Summary:
${topMatch ? `- Top Business Match: ${topMatch.name} (${topMatch.fitScore}% match)` : ""}
- Motivation: ${quizData.mainMotivation}
- First Income Goal: ${quizData.firstIncomeTimeline}
- Monthly Income Goal: $${quizData.successIncomeGoal}
- Upfront Investment: $${quizData.upfrontInvestment}
- Passion Alignment: ${getRatingDescription(quizData.passionIdentityAlignment)}

Work Preferences:
- Time Availability: ${quizData.weeklyTimeCommitment}
- Learning Style: ${quizData.learningPreference || "self_directed"}
- Work Structure: ${quizData.workStructurePreference || "flexible"}
- Collaboration Style: ${quizData.workCollaborationPreference || "independent"}
- Decision-Making Style: ${quizData.decisionMakingStyle}

Personality Traits:
- Social Comfort: ${getRatingDescription(quizData.salesComfort || 3)}
- Self-Motivation: ${getRatingDescription(quizData.selfMotivationLevel || 3)}
- Risk Tolerance: ${getRatingDescription(quizData.riskComfortLevel || 3)}
- Tech Comfort: ${getRatingDescription(quizData.techSkillsRating || 3)}
- Structure Preference: ${quizData.workStructurePreference || "flexible"}
- Feedback Response: ${getRatingDescription(quizData.feedbackRejectionResponse || 3)}
- Creativity: ${getRatingDescription(quizData.creativeWorkEnjoyment || 3)}
- Brand Comfort: ${getRatingDescription(quizData.brandFaceComfort || 3)}
- Competitiveness: ${getRatingDescription(quizData.competitivenessLevel || 3)}
- Communication: ${getRatingDescription(quizData.directCommunicationEnjoyment || 3)}
- Organization: ${getRatingDescription(quizData.organizationLevel || 3)}
- Uncertainty Handling: ${getRatingDescription(quizData.uncertaintyHandling || 3)}
`.trim();
  }

  private buildResultsPreviewPrompt(quizData: QuizData, topPaths: BusinessPath[]): string {
      const userProfile = this.createUserProfile(quizData, topPaths[0]);

    return `Based on your quiz data and your top business model, generate the following:

### Preview Insights
Write 3 paragraphs analyzing why you are a strong fit for ${topPaths[0].name}, based on your quiz results.

   - Paragraph 1: Explain why this business model aligns with your goals, constraints, and personality traits. Be specific about how your exact quiz responses connect to this business model's requirements.
   - Paragraph 2: Describe your natural advantages in executing this model (skills, traits, or behaviors). Reference specific traits from your quiz that give you an edge in this field.
   - Paragraph 3: Identify one potential challenge you may face based on your profile, and how to overcome it. Be honest but constructive about areas where you might need to grow.

   Each paragraph must be a minimum of 3 sentences. Longer, more detailed paragraphs are encouraged. Do not write any paragraph shorter than 3 sentences.
   Use specific references to your traits and quiz responses. Avoid generic phrases. Keep the tone personal, professional, and directly addressing you.

### Key Insights
- 4 bullet points summarizing the most important findings about your business style, risk tolerance, or strategic fit.

### Success Predictors
- 4 bullet points explaining which traits or behaviors from your quiz predict a high chance of success. These should be personal, specific, and based on your actual quiz data.

CRITICAL RULES:
- Use only the data from your profile.
- Do NOT invent data or use generic filler.
- Use clear, concise language that directly addresses you.
- Ban phrases like "powerful foundation", "natural strengths", "unique combination of traits".
- Every paragraph must reference specific traits from your quiz.
- Max 550 characters per paragraph.
- Always use "you" and "your" instead of "the user" or "the user's".

YOUR PROFILE:
${userProfile}`;
  }

  private buildPersonalizedInsightsPrompt(quizData: QuizData, topPaths: BusinessPath[], bottomPaths: BusinessPath[]): string {
    const userProfile = this.createUserProfile(quizData);
    
    return `Based only on your quiz data and the provided top 3 and bottom 3 business matches, generate the following. This is for a full business analysis report. Be specific and use only known data.

### Personalized Recommendations
Write 3-4 paragraphs with specific, actionable recommendations for your top business model matches. Focus on next steps, skill development, and strategic approaches based on your profile.

### Potential Challenges
Write 2-3 paragraphs identifying potential challenges you may face based on your quiz responses, and how to overcome them. Be honest but constructive.

### Top Fit Explanation
Write 2-3 paragraphs explaining why your top 3 business models are strong matches for you:
1. ${topPaths[0]?.name || "N/A"} (${topPaths[0]?.fitScore || "N/A"}%)
2. ${topPaths[1]?.name || "N/A"} (${topPaths[1]?.fitScore || "N/A"}%)
3. ${topPaths[2]?.name || "N/A"} (${topPaths[2]?.fitScore || "N/A"}%)

### Bottom Fit Explanation
Write 2-3 paragraphs explaining why your bottom 3 business models are poor matches for you, and what would need to change for them to become viable:
1. ${bottomPaths[0]?.name || "N/A"} (${bottomPaths[0]?.fitScore || "N/A"}%)
2. ${bottomPaths[1]?.name || "N/A"} (${bottomPaths[1]?.fitScore || "N/A"}%)
3. ${bottomPaths[2]?.name || "N/A"} (${bottomPaths[2]?.fitScore || "N/A"}%)

CRITICAL RULES:
- Use ONLY the following data:
  ${userProfile}
- Use clean, specific, professional language only.
- Do NOT invent numbers, ratings, or filler traits.
- Always use "you" and "your" instead of "the user" or "the user's".
- Be specific about how your quiz responses connect to each business model.`;
  }

  private buildCharacteristicsPrompt(quizData: QuizData): string {
    const userProfile = this.createUserProfile(quizData);
    
    return `Based on your quiz responses, identify 6 key personality characteristics that define your entrepreneurial style. Return ONLY a JSON object with this exact structure:

{
  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3", "characteristic 4", "characteristic 5", "characteristic 6"]
}

Each characteristic should be 2-4 words maximum. Focus on traits that directly relate to business success and entrepreneurship.

YOUR PROFILE:
${userProfile}`;
  }

  // Enhanced results preview generation with intelligent checks
  async generateResultsPreview(
    quizData: QuizData,
    topPaths: BusinessPath[],
    quizAttemptId?: string | null,
  ): Promise<{
    previewInsights: string;
    keyInsights: string[];
    successPredictors: string[];
  }> {
    try {
      // First check if we have existing AI content in database
      if (quizAttemptId) {
        console.log(` Checking for existing preview content for quiz attempt ${quizAttemptId}`);
        const existingContent = await this.getAIContentFromDatabase(
          quizAttemptId,
          "preview",
        );
        if (existingContent) {
          console.log(`✅ Using existing preview insights from database for quiz attempt ${quizAttemptId}`);
          return existingContent;
        }
      }

      console.log(` Generating fresh preview insights for quiz attempt ${quizAttemptId || 'unknown'}`);

      // Generate fresh content using OpenAI chat endpoint directly
      const { APIClient } = await import('./apiClient');
      const promptText = this.buildResultsPreviewPrompt(quizData, topPaths);
      console.log("🤖 Making OpenAI API call with prompt length:", promptText.length);
      console.log("🔗 API endpoint:", `${API_BASE}/api/openai-chat`);

      const response = await APIClient.fetchWithTimeout(`${API_BASE}/api/openai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a business consultant specializing in helping people find the perfect business model based on their personality, skills, and goals."
            },
            {
              role: "user",
              content: promptText
            }
          ],
          maxTokens: 1200,
          temperature: 0.7
        }),
      }, 45000); // 45 second timeout for AI requests

      console.log("📡 OpenAI API response status:", response.status, response.statusText);

      const responseText = await response.text();
      console.log("📥 OpenAI API response text length:", responseText.length);
      console.log("📥 OpenAI API response preview:", responseText.substring(0, 200) + "...");

      if (!response.ok) {
        console.error('❌ AI API Error Response:', responseText);

        // Check if response is HTML (indicates API endpoint not found or server error)
        if (responseText.includes('<!doctype') || responseText.includes('<html')) {
          console.warn('⚠️ OpenAI API endpoint returned HTML, using fallback content');
          return this.getFallbackResultsPreview(quizData, topPaths);
        }

        // If OpenAI API key is not configured, use fallback
        if (response.status === 500 && responseText.includes('not configured')) {
          console.warn('⚠️ OpenAI API key not configured - AI insights disabled');
          console.warn('💡 To enable AI insights, set OPENAI_API_KEY environment variable');
          return this.getFallbackResultsPreview(quizData, topPaths);
        }

        console.error(`💥 OpenAI API error, using fallback: ${response.status} - ${responseText}`);
        return this.getFallbackResultsPreview(quizData, topPaths);
      }

      // Validate JSON response
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("✅ Successfully parsed OpenAI API response");
        console.log("📄 Response data keys:", Object.keys(data));
      } catch (parseError) {
        console.error('❌ Failed to parse API response as JSON:', responseText);
        if (responseText.includes('<!doctype') || responseText.includes('<html')) {
          console.warn('⚠️ Received HTML response instead of JSON, using fallback');
          return this.getFallbackResultsPreview(quizData, topPaths);
        }
        console.error('💥 JSON parse error, using fallback:', parseError);
        return this.getFallbackResultsPreview(quizData, topPaths);
      }

      const content = data.choices?.[0]?.message?.content || data.content || data.text || '';
      console.log("🎯 Extracted content length:", content.length);
      console.log("🎯 Content preview:", content.substring(0, 300) + "...");

      if (!content || content.length < 50) {
        console.warn('⚠️ OpenAI response content too short or empty, using fallback');
        console.log("🔍 Full data object:", JSON.stringify(data, null, 2));
        return this.getFallbackResultsPreview(quizData, topPaths);
      }

      // Parse the response
      const insightsMatch = content.match(/### Preview Insights\n([\s\S]*?)(?=\n###|$)/);
      const keyInsightsMatch = content.match(/### Key Insights\n([\s\S]*?)(?=\n###|$)/);
      const predictorsMatch = content.match(/### Success Predictors\n([\s\S]*?)(?=\n###|$)/);

      console.log("📋 Parsing results:", {
        insightsFound: !!insightsMatch,
        keyInsightsFound: !!keyInsightsMatch,
        predictorsFound: !!predictorsMatch
      });

      const keyInsights = keyInsightsMatch
        ? keyInsightsMatch[1]
            .split("\n")
            .filter((line: string) => line.trim().startsWith("-"))
            .map((line: string) => line.trim().substring(1).trim())
        : [];

      const successPredictors = predictorsMatch
        ? predictorsMatch[1]
            .split("\n")
            .filter((line: string) => line.trim().startsWith("-"))
            .map((line: string) => line.trim().substring(1).trim())
        : [];

      // Remove the heading from previewInsights
      let previewInsights = insightsMatch ? insightsMatch[1].trim() : "";
      if (previewInsights.startsWith('### Preview Insights')) {
        previewInsights = previewInsights.replace(/^### Preview Insights\s*/, '');
      }
      // Also, if the AI returns the heading in the first paragraph, remove it
      previewInsights = previewInsights.replace(/^#+\s*Preview Insights\s*/i, '');

      const result = {
        previewInsights,
        keyInsights,
        successPredictors,
      };

      console.log("🎉 Final AI-generated result:", {
        previewInsightsLength: result.previewInsights.length,
        keyInsightsCount: result.keyInsights.length,
        successPredictorsCount: result.successPredictors.length
      });

      // If the parsing failed or content is too generic, use fallback
      if (!result.previewInsights || result.previewInsights.length < 100 ||
          result.keyInsights.length === 0 ||
          result.successPredictors.length === 0) {
        console.warn('⚠️ AI content parsing failed or too short, using fallback');
        return this.getFallbackResultsPreview(quizData, topPaths);
      }

      // Save to database if we have a quiz attempt ID
      if (quizAttemptId) {
        try {
          await this.saveAIContentToDatabase(quizAttemptId, "preview", result);
          console.log(` Saved preview insights to database for quiz attempt ${quizAttemptId}`);
        } catch (saveError) {
          console.error("Failed to save preview insights to database:", saveError);
        }
      }

      console.log("✅ Returning AI-generated content (not fallback)");
      return result;
    } catch (error) {
      console.error("Error generating results preview:", error);
      console.log(`⚠️ Using fallback preview content due to error`);
      return this.getFallbackPreviewContent(quizData, topPaths);
    }
  }

  // Enhanced personalized insights generation with intelligent checks
  async generatePersonalizedInsights(
    quizData: QuizData,
    topPaths: BusinessPath[],
    bottomPaths: BusinessPath[],
    quizAttemptId?: string | null,
  ): Promise<{
    personalizedRecommendations: string;
    potentialChallenges: string;
    topFitExplanation: string;
    bottomFitExplanation: string;
  }> {
    try {
      // First check if we have existing AI content in database
      if (quizAttemptId) {
        console.log(` Checking for existing fullReport content for quiz attempt ${quizAttemptId}`);
        const existingContent = await this.getAIContentFromDatabase(
          quizAttemptId,
          "fullReport",
        );
        if (existingContent) {
          console.log(`✅ Using existing full report insights from database for quiz attempt ${quizAttemptId}`);
          return existingContent;
        }
      }

      console.log(` Generating fresh full report insights for quiz attempt ${quizAttemptId || 'unknown'}`);
      
      // Generate fresh content
      const response = await fetch(`${API_BASE}/api/openai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a business consultant specializing in helping people find the perfect business model based on their personality, skills, and goals."
            },
            {
              role: "user",
              content: this.buildPersonalizedInsightsPrompt(quizData, topPaths, bottomPaths)
            }
          ],
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error('Personalized insights API error:', responseText);
        throw new Error(`OpenAI API error: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse personalized insights response:', responseText);
        throw new Error('Invalid JSON response from API');
      }
      const content = data.content;

      // Parse the response
      const recommendationsMatch = content.match(/### Personalized Recommendations\n([\s\S]*?)(?=\n###|$)/);
      const challengesMatch = content.match(/### Potential Challenges\n([\s\S]*?)(?=\n###|$)/);
      const topFitMatch = content.match(/### Top Fit Explanation\n([\s\S]*?)(?=\n###|$)/);
      const bottomFitMatch = content.match(/### Bottom Fit Explanation\n([\s\S]*?)(?=\n###|$)/);

      const result = {
        personalizedRecommendations: recommendationsMatch ? recommendationsMatch[1].trim() : "",
        potentialChallenges: challengesMatch ? challengesMatch[1].trim() : "",
        topFitExplanation: topFitMatch ? topFitMatch[1].trim() : "",
        bottomFitExplanation: bottomFitMatch ? bottomFitMatch[1].trim() : "",
      };

      // Save to database if we have a quiz attempt ID
      if (quizAttemptId) {
        try {
          await this.saveAIContentToDatabase(quizAttemptId, "fullReport", result);
          console.log(` Saved full report insights to database for quiz attempt ${quizAttemptId}`);
        } catch (saveError) {
          console.error("Failed to save full report insights to database:", saveError);
        }
      }

      return result;
    } catch (error) {
      console.error("Error generating personalized insights:", error);
      console.log(`⚠️ Using fallback full report content due to error`);
      return this.getFallbackFullReportContent(quizData, topPaths, bottomPaths);
    }
  }

  // Enhanced model insights generation with intelligent checks
  async generateModelInsights(
    quizData: QuizData,
    modelName: string,
    fitType: "best" | "strong" | "possible" | "poor",
    quizAttemptId?: string | null,
  ): Promise<{
    modelFitReason: string;
    keyInsights?: string[];
    successPredictors?: string[];
  }> {
    try {
      // First check if we have existing AI content in database
      if (quizAttemptId) {
        console.log(` Checking for existing model_${modelName} content for quiz attempt ${quizAttemptId}`);
        const existingContent = await this.getAIContentFromDatabase(
          quizAttemptId,
          `model_${modelName}`,
        );
        if (existingContent) {
          console.log(
            `✅ Using existing model insights for ${modelName} from database (NO API CALL)`,
          );
          return existingContent;
        }
        console.log(`❌ No existing model_${modelName} content found, will generate new API call`);
      }

      console.log(
        ` Generating fresh model insights for ${modelName} (${fitType}) (API CALL)`,
      );
      const userProfile = this.createUserProfile(quizData);
      let fitPrompt = "";

      switch (fitType) {
        case "best":
          fitPrompt = "Explain why this model is the best match for your profile. Focus on specific strengths and advantages.";
          break;
        case "strong":
          fitPrompt = "Explain why this model is a strong match for your profile, noting areas for growth.";
          break;
        case "possible":
          fitPrompt = "Explain why this model is a possible match for your profile, noting what would need to improve.";
          break;
        case "poor":
          fitPrompt = "Clearly explain why this model is misaligned with your profile. End with future-oriented line (what would need to change for you).";
          break;
      }

      const response = await this.makeOpenAIRequest({
        messages: [
          {
            role: "system",
            content: "You are an AI business coach. Use JSON output. Use a professional and direct tone. Do not invent data.",
          },
          {
            role: "user",
            content: `Generate personalized AI content for the business model \"${modelName}\" based on your quiz data and fit type \"${fitType}\".\n\n${fitPrompt}\n\nReturn exactly this JSON structure:\n{\n  \"modelFitReason\": \"Single paragraph explaining fit\"\n}\n\nCRITICAL RULES:\n- Use existing profile data only\n- Do not generate markdown or formatted code blocks\n- Keep modelFitReason a single paragraph\n- Return clean, JSON-parsed output\n- Max 400 tokens total\n- Always use \"you\" and \"your\" instead of \"the user\" or \"the user's\"\n\nYOUR PROFILE:\n${userProfile}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });

      if (response && response.content) {
        try {
          // Clean up the response content to ensure valid JSON
          let cleanContent = response.content.trim();
          cleanContent = cleanContent
            .replace(/```json\s*/g, "")
            .replace(/```\s*/g, "");

          const firstBrace = cleanContent.indexOf("{");
          const lastBrace = cleanContent.lastIndexOf("}");

          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
          }

          const insights = JSON.parse(cleanContent);

          // Save the generated content intelligently
          if (quizAttemptId) {
            await this.saveAIContentToDatabase(quizAttemptId, `model_${modelName}`, insights);
          }

          return insights;
        } catch (parseError) {
          console.error("JSON parse error in generateModelInsights:", response.content);
          console.error("Parse error details:", parseError);
          return this.getFallbackModelInsights(modelName, fitType);
        }
      }

      throw new Error("No valid response from AI service");
    } catch (error) {
      console.error(`Error generating model insights for ${modelName}:`, error);
      return this.getFallbackModelInsights(modelName, fitType);
    }
  }

  // Optimized OpenAI request with system message structure
  private async makeOpenAIRequest(params: {
    messages: { role: string; content: string }[];
    temperature?: number;
    max_tokens?: number;
  }): Promise<{ content: string } | null> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/openai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: params.messages,
          temperature: params.temperature || 0.7,
          max_tokens: params.max_tokens || 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("OpenAI request successful");

      return { content: data.content || data.message || data.response };
    } catch (error) {
      console.error("Error in OpenAI request:", error);
      throw error;
    }
  }

  // Method to retroactively save AI content when unpaid user provides email

  // Database helper methods for AI content storage
  async saveAIContentToDatabase(
    quizAttemptId: string,
    contentType: string,
    content: any,
  ): Promise<void> {
    try {
      // Check if we should save to database (authenticated users or users who provided email)
      const shouldSaveToDatabase = await this.shouldSaveToDatabase();

      if (shouldSaveToDatabase) {
        // TIER 1 & 2: Save to database for authenticated users and email-provided users
        console.log(
          ` Saving ${contentType} AI content to database for quiz attempt ${quizAttemptId}`,
        );

        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/quiz-attempts/attempt/${quizAttemptId}/ai-content`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              contentType,
              content,
            }),
          },
        );

        if (response.ok) {
          console.log(`${contentType} AI content saved to database`);
        } else {
          console.error(
            `❌ Failed to save ${contentType} AI content to database:`,
            response.status,
          );
          // Fallback to localStorage if database save fails
          // This part of the logic is now redundant as localStorage is removed.
          // The original code had a fallback here, but the new code doesn't.
          // I will remove the fallback as it's no longer applicable.
        }
      } else {
        // TIER 3: Save to localStorage for anonymous users (no email provided)
        console.log(
          ` Saving ${contentType} AI content to localStorage (anonymous user)`,
        );
        // This part of the logic is now redundant as localStorage is removed.
        // The original code had a fallback here, but the new code doesn't.
        // I will remove the fallback as it's no longer applicable.
      }
    } catch (error) {
      console.error(`❌ Error saving ${contentType} AI content:`, error);
      // Fallback to localStorage on any error
      // This part of the logic is now redundant as localStorage is removed.
      // The original code had a fallback here, but the new code doesn't.
      // I will remove the fallback as it's no longer applicable.
    }
  }

  private async shouldSaveToDatabase(): Promise<boolean> {
    try {
      // Check if user is authenticated (paid users always save)
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.log('Auth endpoint returned non-JSON response, assuming not authenticated');
          return false;
        }

        try {
          const data = await response.json();
          if (data.authenticated) {
            console.log(`User authenticated - will save to database`);
            return true;
          }
        } catch (parseError) {
          console.log('Failed to parse auth response, assuming not authenticated');
          return false;
        }
      }

      // For unpaid users, do not save to database (no userEmail check)
      console.log(
        `User not authenticated - will not save to database`,
      );
      return false;
    } catch (error) {
      console.error("Error checking if should save to database:", error);
      return false;
    }
  }

  // Fallback content methods
  private getFallbackPreviewContent(quizData: QuizData, topPaths: BusinessPath[]) {
    const topPath = topPaths[0];
    return {
      previewInsights: `Based on your comprehensive assessment, ${topPath?.name || "your top business model"} appears to be an excellent match for your entrepreneurial goals and personality. Your quiz responses indicate strong alignment with the requirements and challenges of this business path.`,
      keyInsights: [
        "Your personality traits align well with this business model",
        "Your time commitment and investment preferences match the requirements",
        "Your learning style and work preferences support success in this field"
      ],
      successPredictors: [
        "Strong motivation and goal alignment",
        "Appropriate risk tolerance for this business type",
        "Realistic expectations about time and investment requirements"
      ]
    };
  }

  private getFallbackFullReportContent(
    quizData: QuizData,
    topPaths: BusinessPath[],
    bottomPaths: BusinessPath[]
  ) {
    const topPath = topPaths[0];
    const bottomPath = bottomPaths[0];
    
    return {
      personalizedRecommendations: `Focus on developing your core skills for ${topPath?.name || "your top business model"}. Start with a minimum viable approach to test the market and validate your concept. Build a strong foundation before scaling up.`,
      potentialChallenges: `You may face initial learning curves and time management challenges. Income may be inconsistent in the early stages. Success requires consistent daily action and follow-through.`,
      topFitExplanation: `${topPath?.name || "Your top business model"} aligns well with your goals, skills, and preferences. Your quiz responses indicate strong compatibility with this business approach.`,
      bottomFitExplanation: `${bottomPath?.name || "Your bottom business model"} doesn't align well with your current profile. Your preferences and constraints make this path challenging at this time.`
    };
  }

  private getFallbackModelInsights(
    modelName: string,
    fitType: "best" | "strong" | "possible" | "poor"
  ) {
    switch (fitType) {
      case "best":
        return {
          modelFitReason: `${modelName} is the best match for your entrepreneurial profile. Your quiz responses indicate strong alignment with the requirements, challenges, and opportunities of this business model.`
        };
      case "strong":
        return {
          modelFitReason: `${modelName} is a strong match for your profile with room for growth. Your responses show compatibility with some aspects of this business model, though you may need to develop certain skills or adjust expectations.`
        };
      case "possible":
        return {
          modelFitReason: `${modelName} is a possible match for your profile. With some adjustments and skill development, this could become more viable for you in the future.`
        };
      case "poor":
        return {
          modelFitReason: `${modelName} doesn't align well with your current profile and preferences. Your quiz responses indicate potential conflicts with the requirements or challenges of this business model. Consider what would need to change for this to become viable.`
        };
    }
  }

  // Full report content generation - only generates business fit descriptions and challenges
  async generateFullReportContent(
    quizData: QuizData,
    topBusinessModels: any[],
    bottomBusinessModels: any[],
  ): Promise<{
    businessFitDescriptions: { [key: string]: string };
    businessAvoidDescriptions: { [key: string]: string };
    potentialChallenges: string[];
  }> {
    try {
      console.log("Generating full report content (business fit descriptions and challenges only)");

      const userProfile = this.createUserProfile(
        quizData,
        topBusinessModels[0],
      );

      const response = await this.makeOpenAIRequest({
        messages: [
          {
            role: "system",
            content:
              "You are an AI business coach. Use JSON output. Use a professional and direct tone. Do not invent data.",
          },
          {
            role: "user",
            content: `Generate business analysis for you based on your quiz data and top 3 business models.

Generate the following content:

1. Business Fit Descriptions: For each of the top 3 business models, write a single paragraph explaining why this model fits your profile.

2. Business Avoid Descriptions: For each of the bottom 3 business models, write a single paragraph explaining potential challenges or reasons why this model might not be ideal for your profile.

3. Potential Challenges: 4-5 general challenges you might face based on your quiz responses and profile.

Top 3 Business Models (Best Fits):
${topBusinessModels.map((model, index) => `${index + 1}. ${model.name} (${model.score}% match)`).join("\n")}

Bottom 3 Business Models (Worst Fits):
${bottomBusinessModels.map((model, index) => `${index + 1}. ${model.name} (${model.score}% match)`).join("\n")}

Return exactly this JSON structure:
{
  "businessFitDescriptions": {
    "${topBusinessModels[0]?.id}": "Paragraph for model 1",
    "${topBusinessModels[1]?.id}": "Paragraph for model 2",
    "${topBusinessModels[2]?.id}": "Paragraph for model 3"
  },
  "businessAvoidDescriptions": {
    "${bottomBusinessModels[0]?.id}": "Paragraph for model 1",
    "${bottomBusinessModels[1]?.id}": "Paragraph for model 2",
    "${bottomBusinessModels[2]?.id}": "Paragraph for model 3"
  },
  "potentialChallenges": ["...", "...", "...", "...", "..."]
}

CRITICAL RULES:
- Use only the data from your profile
- Do NOT invent data or use generic filler
- Each business fit description should be 1 focused paragraph
- Challenges should be realistic based on your profile
- Max 800 tokens total
- Always use "you" and "your" instead of "the user" or "the user's"

YOUR PROFILE:
${userProfile}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      if (response && response.content) {
        try {
          // Clean up the response content to ensure valid JSON
          let cleanContent = response.content.trim();

          // Remove any potential markdown code blocks
          cleanContent = cleanContent
            .replace(/```json\s*/g, "")
            .replace(/```\s*/g, "");

          // Find the JSON object (between first { and last })
          const firstBrace = cleanContent.indexOf("{");
          const lastBrace = cleanContent.lastIndexOf("}");

          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
          }

          const result = JSON.parse(cleanContent);
          console.log(
            "Full report content generated successfully",
          );
          return {
            businessFitDescriptions: result.businessFitDescriptions || {},
            businessAvoidDescriptions: result.businessAvoidDescriptions || {},
            potentialChallenges: result.potentialChallenges || [],
          };
        } catch (parseError) {
          console.error(
            "JSON parse error in generateFullReportContent:",
            response.content,
          );
          console.error("Parse error details:", parseError);
          throw parseError;
        }
      }

      throw new Error("No response from OpenAI");
    } catch (error) {
      console.error(
        "Error generating full report content:",
        error,
      );

      // Return fallback content
      const fallbackFitDescriptions: { [key: string]: string } = {};
      const fallbackAvoidDescriptions: { [key: string]: string } = {};
      topBusinessModels.forEach((model) => {
        fallbackFitDescriptions[model.id] =
          `${model.name} appears to be a good match based on your quiz responses and entrepreneurial goals.`;
      });
      bottomBusinessModels.forEach((model) => {
        fallbackAvoidDescriptions[model.id] =
          `${model.name} may present challenges related to your specific profile and preferences.`;
      });

      return {
        businessFitDescriptions: fallbackFitDescriptions,
        businessAvoidDescriptions: fallbackAvoidDescriptions,
        potentialChallenges: [
          "Time management while building your business",
          "Learning new skills and technologies",
          "Finding and retaining customers",
          "Managing finances and cash flow",
        ],
      };
    }
  }

  async generateAllCharacteristics(
    quizData: QuizData,
    quizAttemptId?: string | null,
  ): Promise<{
    characteristics: string[];
  }> {
    try {
      // First check if we have existing AI content in database
      if (quizAttemptId) {
        console.log(` Checking for existing characteristics content for quiz attempt ${quizAttemptId}`);
        const existingContent = await this.getAIContentFromDatabase(
          quizAttemptId,
          "characteristics",
        );
        if (existingContent) {
          console.log(`✅ Using existing characteristics from database for quiz attempt ${quizAttemptId}`);
          return existingContent;
        }
      }

      console.log(` Generating fresh characteristics for quiz attempt ${quizAttemptId || 'unknown'}`);
      
      // Generate fresh content
      const response = await fetch(`${API_BASE}/api/openai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a business consultant specializing in helping people find the perfect business model based on their personality, skills, and goals."
            },
            {
              role: "user",
              content: this.buildCharacteristicsPrompt(quizData)
            }
          ],
          maxTokens: 200,
          temperature: 0.7
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error('Business model fit descriptions API error:', responseText);
        throw new Error(`OpenAI API error: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse business model fit descriptions response:', responseText);
        throw new Error('Invalid JSON response from API');
      }
      const content = data.content;

      // Parse the JSON response
      let characteristics: string[] = [];
      try {
        const parsed = JSON.parse(content);
        characteristics = parsed.characteristics || [];
      } catch (parseError) {
        console.error("Error parsing characteristics JSON:", parseError);
        characteristics = [
          "Entrepreneurial mindset",
          "Strategic thinking",
          "Risk management",
          "Adaptability",
          "Goal-oriented",
          "Self-motivated"
        ];
      }

      const result = { characteristics };

      // Save to database if we have a quiz attempt ID
      if (quizAttemptId) {
        try {
          await this.saveAIContentToDatabase(quizAttemptId, "characteristics", result);
          console.log(` Saved characteristics to database for quiz attempt ${quizAttemptId}`);
        } catch (saveError) {
          console.error("Failed to save characteristics to database:", saveError);
        }
      }

      return result;
    } catch (error) {
      console.error("Error generating characteristics:", error);
      throw error;
    }
  }

  // Method to clear business model AI content for new paid quiz attempts
  async clearBusinessModelAIContent(userId: number): Promise<void> {
    try {
      console.log(`🧹 Clearing business model AI content for user ${userId} due to new paid quiz attempt`);
      
      const response = await fetch("/api/clear-business-model-ai-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Cleared ${result.deletedCount} business model AI content entries for user ${userId}`);
      } else {
        console.error(`❌ Failed to clear business model AI content: ${response.status}`);
      }
    } catch (error) {
      console.error("Error clearing business model AI content:", error);
    }
  }

  // Fallback method when OpenAI is not available
  private getFallbackResultsPreview(quizData: QuizData, topPaths: BusinessPath[]): {
    previewInsights: string;
    keyInsights: string[];
    successPredictors: string[];
    isFallback?: boolean;
  } {
    const topPath = topPaths[0] || { name: "Entrepreneurship", fitScore: 75 };
    console.log("🔄 Using fallback content for results preview - OpenAI unavailable");

    return {
      previewInsights: `Based on your comprehensive quiz responses, ${topPath.name} emerges as your strongest business model match with a ${topPath.fitScore}% compatibility score. Your answers reveal a personality profile and goal alignment that naturally fits this entrepreneurial path.

Your demonstrated risk tolerance, working style preferences, and time investment capabilities align exceptionally well with what ${topPath.name} demands. This convergence suggests you possess the fundamental mindset needed to navigate both the challenges and opportunities this business model typically presents.

Success in ${topPath.name} will ultimately depend on systematically developing the specialized skills and deep market knowledge this field requires. We recommend focusing your learning efforts on mastering the core competencies and operational frameworks that drive results in this specific business model.`,

      keyInsights: [
        `${topPath.name} achieves a ${topPath.fitScore}% compatibility match with your unique profile and entrepreneurial goals`,
        "Your demonstrated risk tolerance and investment preferences perfectly align with this business model's requirements",
        "Your personality traits and working style preferences indicate strong potential for sustainable success in this field",
        "Strategic skill development in core ${topPath.name} competencies will be your primary pathway to achieving results",
        "Your time availability and commitment level match the typical demands this business model requires for profitability"
      ],

      successPredictors: [
        "Your clearly defined goals and high motivation levels create a solid foundation for sustained business development",
        "Your measured approach to risk-taking and financial investment aligns with proven success patterns in this field",
        "Your preferred working style and time management approach match the operational demands of successful ${topPath.name} ventures",
        "Your realistic understanding of both challenges and rewards indicates mature expectations essential for long-term business success",
        "Your learning preferences and skill development approach position you well for mastering the expertise this business model requires"
      ],
      isFallback: true
    };
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
