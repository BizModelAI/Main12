import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
  BarChart3,
  Award,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { reportViewManager } from "../utils/reportViewManager";
import { AICacheManager } from "../utils/aiCacheManager";
import { useAIInsights } from '../contexts/AIInsightsContext';

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

interface QuizCompletionLoadingProps {
  quizData: QuizData;
  userEmail?: string | null;
  onComplete: (data: {
    personalizedPaths: BusinessPath[];
    aiInsights: any;
  }) => void;
  onExit?: () => void;
}

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "pending" | "active" | "completed";
  estimatedTime: number; // in seconds
  completed: boolean; // New field for completion status
}

const QuizCompletionLoading: React.FC<QuizCompletionLoadingProps> = ({
  quizData,
  userEmail,
  onComplete,
  onExit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [maxProgress, setMaxProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loadingResults, setLoadingResults] = useState<any>({});
  const isMobile = useIsMobile();
  const [currentMobileStep, setCurrentMobileStep] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const { setAIInsights } = useAIInsights();

  // Restore targetProgress and smooth animation logic
  const [targetProgress, setTargetProgress] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const loadingSteps: LoadingStep[] = [
    {
      id: "analyzing-profile",
      title: "Analyzing Your Profile",
      description: "Processing your quiz responses and personality traits",
      icon: Brain,
      status: "pending",
      estimatedTime: 3,
      completed: false,
    },
    {
      id: "generating-matches",
      title: "Finding Perfect Business Matches",
      description: "AI is matching you with the best business models",
      icon: Target,
      status: "pending",
      estimatedTime: 5,
      completed: false,
    },
    {
      id: "creating-insights",
      title: "Creating Personalized Insights",
      description: "Generating custom recommendations based on your strengths",
      icon: Sparkles,
      status: "pending",
      estimatedTime: 4,
      completed: false,
    },
    {
      id: "building-characteristics",
      title: "Building Your Entrepreneur Profile",
      description: "Identifying your unique entrepreneurial characteristics",
      icon: Users,
      status: "pending",
      estimatedTime: 3,
      completed: false,
    },
    {
      id: "generating-descriptions",
      title: "Crafting Business Fit Analysis",
      description: "Creating detailed explanations for your top matches",
      icon: BarChart3,
      status: "pending",
      estimatedTime: 4,
      completed: false,
    },
    {
      id: "finalizing-report",
      title: "Finalizing Your Report",
      description:
        "Putting together your comprehensive business analysis with personalized insights",
      icon: Award,
      status: "pending",
      estimatedTime: 5,
      completed: false,
    },
  ];

  // --- REFACTORED LOGIC START ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Remove duplicate steps state
  // const [steps, setSteps] = useState<LoadingStep[]>(loadingSteps);
  const [steps, setSteps] = useState<LoadingStep[]>(loadingSteps.map((s) => ({ ...s, completed: false })));

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let isUnmounted = false;

    const runSteps = async () => {
      if (isComplete) return;
      for (let stepIndex = 0; stepIndex < loadingSteps.length; stepIndex++) {
        if (isUnmounted || isComplete) return;
        setCurrentStepIndex(stepIndex);
        setSteps((prev) =>
          prev.map((step, index) => ({
            ...step,
            status: index === stepIndex ? "active" : index < stepIndex ? "completed" : "pending",
            completed: index < stepIndex,
          }))
        );
        // Animate progress for this step
        const stepStartProgress = (stepIndex / loadingSteps.length) * 100;
        const stepEndProgress = ((stepIndex + 1) / loadingSteps.length) * 100;
        const stepDuration = 3500; // 3.5 seconds per card
        const stepStartTime = Date.now();
        let animationFrame: number;
        const animateStepProgress = () => {
          if (isUnmounted || isComplete) return;
          const stepElapsed = Date.now() - stepStartTime;
          const stepProgressRatio = Math.min(stepElapsed / stepDuration, 1);
          // Ease in-out
          const easedRatio = stepProgressRatio - ((Math.cos(stepProgressRatio * Math.PI) - 1) / 2) * 0.1;
          const currentProgress = stepStartProgress + (stepEndProgress - stepStartProgress) * easedRatio;
          setProgress(currentProgress);
          if (stepProgressRatio < 1 && !isComplete) {
            animationFrame = requestAnimationFrame(animateStepProgress);
          }
        };
        animationFrame = requestAnimationFrame(animateStepProgress);
        cleanup = () => {
          if (animationFrame) cancelAnimationFrame(animationFrame);
        };
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
        setSteps((prev) =>
          prev.map((step, index) => ({
            ...step,
            completed: index <= stepIndex,
            status: index < stepIndex + 1 ? "completed" : index === stepIndex + 1 ? "active" : "pending",
          }))
        );
        cancelAnimationFrame(animationFrame);
      }
      // Final progress animation to 100%
      let finalAnimationFrame: number;
      const animateFinalProgress = () => {
        setProgress((prev) => {
          const remaining = 100 - prev;
          const increment = remaining * 0.1;
          const newProgress = Math.min(prev + increment, 100);
          if (newProgress < 100) {
            finalAnimationFrame = requestAnimationFrame(animateFinalProgress);
          }
          return newProgress;
        });
      };
      finalAnimationFrame = requestAnimationFrame(animateFinalProgress);
      setTimeout(() => {
        if (finalAnimationFrame) cancelAnimationFrame(finalAnimationFrame);
        setProgress(100);
        setSteps((prev) => prev.map((step) => ({ ...step, completed: true, status: "completed" })));
        setCurrentStepIndex(loadingSteps.length - 1);
        setIsComplete(true);
        if (typeof onComplete === "function") onComplete(loadingResults);
      }, 1000);
    };
    runSteps();
    return () => {
      isUnmounted = true;
      if (cleanup) cleanup();
    };
  }, [quizData]);
// --- REFACTORED LOGIC END ---

  // Clear any potentially stuck state on component mount and handle mobile detection
  useEffect(() => {
    console.log(
      " QuizCompletionLoading component mounted, clearing any stuck state",
    );
    console.log(" Mobile detection:", isMobile);
    localStorage.removeItem("ai-generation-in-progress");
    localStorage.removeItem("ai-generation-timestamp");

    // Mobile vs desktop detection
    if (isMobile) {
      console.log(" Mobile detected - auto-cycling cards");
    } else {
      console.log(" Desktop detected - showing all cards");
    }
  }, [isMobile]);

  // Auto-cycle through mobile steps every 4 seconds, only once
  useEffect(() => {
    if (!isMobile || isLoadingComplete) return;

    const interval = setInterval(() => {
      setCurrentMobileStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        // Stay on the last step (step 6)
        return prev;
      });
    }, 4200); // Slightly longer timing to match step execution

    return () => clearInterval(interval);
  }, [isMobile, steps.length, isLoadingComplete]);

  // Sync mobile step with current step execution for better coordination
  useEffect(() => {
    if (isMobile && currentStep >= 0) {
      // Optionally sync with current executing step, but allow auto-cycling to continue
      // This ensures mobile doesn't fall behind the actual execution
      if (currentStep > currentMobileStep) {
        setCurrentMobileStep(Math.min(currentStep, steps.length - 1));
      }
    }
  }, [currentStep, isMobile, currentMobileStep, steps.length]);

  // Calculate target progress based on step completion and elapsed time
  useEffect(() => {
    if (isLoadingComplete) {
      setTargetProgress(100);
      return;
    }
    
    const totalSteps = steps.length;
    const completedStepsCount = completedSteps.size;
    const activeStepProgress = currentStep >= 0 ? 1 : 0;

    // Each completed step is worth (100/totalSteps)%
    // Active step gets partial credit
    const stepProgress = (completedStepsCount * 100) / totalSteps;
    const activeProgress = activeStepProgress * (100 / totalSteps) * 0.3; // 30% of step value for active

    // Optionally, add a time-based minimum progress to avoid stalling
    const elapsed = Date.now() - startTime;
    const minProgress = Math.min((elapsed / 20000) * 90, 90); // 20s = 90%

    let newTargetProgress = Math.max(
      stepProgress + activeProgress,
      minProgress,
    );
    newTargetProgress = Math.min(newTargetProgress, 99);
    setTargetProgress(newTargetProgress);
  }, [currentStep, completedSteps, steps.length, isLoadingComplete, startTime]);

  // Smooth progress bar animation toward target
  useEffect(() => {
    if (isLoadingComplete) return; // Stop animation when loading is complete
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.1) return targetProgress;
        return prev + diff * 0.05; // Smooth interpolation
      });
    }, 50);
    return () => clearInterval(interval);
  }, [targetProgress, isLoadingComplete]);

  // Reset startTime on mount or quizData change
  useEffect(() => {
    setStartTime(Date.now());
  }, [quizData]);

  // When loading is complete and progress reaches 100, delay and then call onComplete
  useEffect(() => {
    if (isLoadingComplete && Math.abs(progress - 100) < 0.1) {
      const timeout = setTimeout(() => {
        // Only call onComplete if not already called
        if (typeof onComplete === "function") {
          onComplete(loadingResults);
        }
      }, 175); // 175ms delay for visual finish
      return () => clearTimeout(timeout);
    }
  }, [isLoadingComplete, progress, onComplete, loadingResults]);

  // Generate all 6 characteristics with OpenAI
  const generateAllCharacteristics = async (
    quizData: QuizData,
  ): Promise<string[]> => {
    try {
      // Helper function to convert numerical ratings to descriptive text
      const getRatingDescription = (rating: number): string => {
        if (rating >= 4) return "high";
        if (rating >= 3) return "moderate";
        return "low";
      };

      const prompt = `Based on this quiz data, generate exactly 6 short positive characteristics that reflect the user's entrepreneurial strengths. Each should be 3-5 words maximum and highlight unique aspects of their entrepreneurial potential.

Quiz Data:
- Self-motivation level: ${getRatingDescription(quizData.selfMotivationLevel)}
- Risk comfort level: ${getRatingDescription(quizData.riskComfortLevel)}
- Tech skills rating: ${getRatingDescription(quizData.techSkillsRating)}
- Direct communication enjoyment: ${getRatingDescription(quizData.directCommunicationEnjoyment)}
- Learning preference: ${quizData.learningPreference}
- Organization level: ${getRatingDescription(quizData.organizationLevel)}
- Creative work enjoyment: ${getRatingDescription(quizData.creativeWorkEnjoyment)}
- Work collaboration preference: ${quizData.workCollaborationPreference}
- Decision making style: ${quizData.decisionMakingStyle}
- Work structure preference: ${quizData.workStructurePreference}
- Long-term consistency: ${getRatingDescription(quizData.longTermConsistency)}
- Uncertainty handling: ${getRatingDescription(quizData.uncertaintyHandling)}
- Tools familiar with: ${quizData.familiarTools?.join(", ")}
- Main motivation: ${quizData.mainMotivation}
- Weekly time commitment: ${quizData.weeklyTimeCommitment}
- Income goal: ${quizData.successIncomeGoal}

Return a JSON object with this exact structure:
{
  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3", "characteristic 4", "characteristic 5", "characteristic 6"]
}

Examples: {"characteristics": ["Highly self-motivated", "Strategic risk-taker", "Tech-savvy innovator", "Clear communicator", "Organized planner", "Creative problem solver"]}`;

      // Add timeout wrapper for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let data: any;
      try {
        const response = await fetch("/api/openai-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            maxTokens: 200,
            temperature: 0.7,
            responseFormat: { type: "json_object" },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(
            `API request failed with status ${response.status}: ${response.statusText}`,
          );
          const errorText = await response.text();
          console.error("Error response body:", errorText);
          throw new Error(
            `API request failed: ${response.status} ${response.statusText}`,
          );
        }

        data = await response.json();
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError?.name === "AbortError") {
          console.error("API request timed out after 30 seconds");
          throw new Error("API request timed out");
        }
        throw fetchError;
      }

      // Check if we have content to work with
      if (!data.content) {
        console.error("No content in API response:", data);
        throw new Error("No content in API response");
      }

      // Clean up the response content (remove markdown code blocks if present)
      let cleanContent = data.content || data || "";
      if (
        typeof cleanContent === "string" &&
        cleanContent.includes("```json")
      ) {
        cleanContent = cleanContent
          .replace(/```json\n?/g, "")
          .replace(/```/g, "");
      }

      const parsed = JSON.parse(cleanContent);
      if (
        parsed &&
        parsed.characteristics &&
        Array.isArray(parsed.characteristics) &&
        parsed.characteristics.length === 6
      ) {
        // Store the characteristics in database
        const quizAttemptId = localStorage.getItem("currentQuizAttemptId");
        if (quizAttemptId) {
          try {
            const { AIService } = await import("../utils/aiService");
            const aiService = AIService.getInstance();
            await aiService.saveAIContentToDatabase(
              quizAttemptId,
              "characteristics",
              { characteristics: parsed.characteristics },
            );
            console.log("Characteristics stored in database");
          } catch (dbError) {
            console.error(
              "❌ CRITICAL: Failed to store characteristics in database:",
              dbError,
            );
            // This is critical data loss - we should notify the user
            // In future: implement user notification system
          }
        }

        return parsed.characteristics;
      } else {
        console.error("Invalid response format:", parsed);
        throw new Error(
          `Invalid response format - expected 6 characteristics, got: ${parsed?.characteristics?.length || "none"}`,
        );
      }
    } catch (error) {
      console.error("Error generating all characteristics:", error);
      console.log("Using fallback characteristics due to API failure");

      // Robust fallback characteristics based on quiz data
      const fallbackCharacteristics = [
        quizData.selfMotivationLevel >= 4
          ? "Highly self-motivated"
          : "Moderately self-motivated",
        quizData.riskComfortLevel >= 4
          ? "High risk tolerance"
          : "Moderate risk tolerance",
        quizData.techSkillsRating >= 4
          ? "Strong tech skills"
          : "Adequate tech skills",
        quizData.directCommunicationEnjoyment >= 4
          ? "Excellent communicator"
          : "Good communicator",
        quizData.organizationLevel >= 4
          ? "Highly organized planner"
          : "Flexible approach to planning",
        quizData.creativeWorkEnjoyment >= 4
          ? "Creative problem solver"
          : "Analytical approach to challenges",
      ];

      console.log(
        "Generated fallback characteristics:",
        fallbackCharacteristics,
      );
      return fallbackCharacteristics;
    }
  };

  // Generate business fit descriptions
  const generateBusinessFitDescriptions = async (
    quizData: QuizData,
  ): Promise<{ [key: string]: string }> => {
    try {
      const { businessModelService } = await import(
        "../utils/businessModelService"
      );
      const topThreeAdvanced = businessModelService.getTopMatches(quizData, 3);

      const businessModels = topThreeAdvanced.map((match) => ({
        id: match.id,
        name: match.name,
        fitScore: match.score,
        description: match.description || "",
      }));

      const { AIService } = await import("../utils/aiService");
      const aiService = AIService.getInstance();

      // Use new generateModelInsights method instead of deprecated one
      const descriptions: { [key: string]: string } = {};

      for (const model of topThreeAdvanced) {
        try {
          const insights = await aiService.generateModelInsights(
            quizData,
            model.name,
            "best",
          );
          descriptions[model.id] = insights.modelFitReason;
        } catch (error) {
          console.error(`Error generating insights for ${model.name}:`, error);
          descriptions[model.id] =
            `This business model shows potential based on your skills and interests.`;
        }
      }

      return descriptions;
    } catch (error) {
      console.error("Error generating business fit descriptions:", error);
      // Set fallback descriptions
      const fallbackDescriptions: { [key: string]: string } = {};
      const { businessModelService } = await import(
        "../utils/businessModelService"
      );
      const topThreeAdvanced = businessModelService.getTopMatches(quizData, 3);

      topThreeAdvanced.forEach((match, index) => {
        fallbackDescriptions[match.id] =
          `This business model aligns well with your ${quizData.selfMotivationLevel >= 4 ? "high self-motivation" : "self-driven nature"} and ${quizData.weeklyTimeCommitment} hours/week availability. Your ${quizData.techSkillsRating >= 4 ? "strong" : "adequate"} technical skills and ${quizData.riskComfortLevel >= 4 ? "high" : "moderate"} risk tolerance make this a ${index === 0 ? "perfect" : index === 1 ? "excellent" : "good"} match for your entrepreneurial journey.`;
      });

      return fallbackDescriptions;
    }
  };

  // Generate business avoid descriptions for bottom 3 matches
  const generateBusinessAvoidDescriptions = async (
    quizData: QuizData,
  ): Promise<{ [key: string]: string }> => {
    try {
      const { businessModelService } = await import(
        "../utils/businessModelService"
      );
      const { businessPaths } = await import("../../../shared/businessPaths");

      const allMatches = businessModelService.getBusinessModelMatches(quizData);

      // Get the bottom 3 business models (worst matches)
      const bottomThree = businessModelService.getBottomMatches(quizData, 3);

      const businessMatches = bottomThree.map((match) => {
        const pathData = businessPaths.find((path) => path.id === match.id);
        return {
          id: match.id,
          name: match.name,
          fitScore: match.score,
          description:
            pathData?.description || "Business model description not available",
          timeToProfit: pathData?.timeToProfit || "Variable",
          startupCost: pathData?.startupCost || "Variable",
          potentialIncome: pathData?.potentialIncome || "Variable",
        };
      });

      const response = await fetch(
        "/api/generate-business-avoid-descriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizData: quizData,
            businessMatches: businessMatches,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate business avoid descriptions");
      }

      const data = await response.json();
      const descriptionsMap: { [key: string]: string } = {};

      if (data && data.descriptions && Array.isArray(data.descriptions)) {
        data.descriptions.forEach(
          (desc: { businessId: string; description: string }) => {
            descriptionsMap[desc.businessId] = desc.description;
          },
        );
      }

      // Store the avoid descriptions in database
      const quizAttemptId = localStorage.getItem("currentQuizAttemptId");
      if (quizAttemptId && Object.keys(descriptionsMap).length > 0) {
        try {
          const { AIService } = await import("../utils/aiService");
          const aiService = AIService.getInstance();
          await aiService.saveAIContentToDatabase(
            quizAttemptId,
            "businessAvoidDescriptions",
            descriptionsMap,
          );
          console.log("Business avoid descriptions stored in database");
        } catch (dbError) {
          console.error(
            "❌ CRITICAL: Failed to store business avoid descriptions in database:",
            dbError,
          );
          // This is critical data loss - we should notify the user
          // In future: implement user notification system
        }
      }

      return descriptionsMap;
    } catch (error) {
      console.error("Error generating business avoid descriptions:", error);
      // Set fallback descriptions
      const fallbackDescriptions: { [key: string]: string } = {};
      const { businessModelService } = await import(
        "../utils/businessModelService"
      );
      const allMatches = businessModelService.getBusinessModelMatches(quizData);
      const bottomThree = businessModelService.getBottomMatches(quizData, 3);

      bottomThree.forEach((match) => {
        fallbackDescriptions[match.id] =
          `This business model scored ${match.score}% for your profile, indicating significant misalignment with your current goals, skills, and preferences. Based on your quiz responses, you would likely face substantial challenges in this field that could impact your success. Consider focusing on higher-scoring business models that better match your natural strengths and current situation. Your ${quizData.riskComfortLevel <= 2 ? "lower risk tolerance" : "risk preferences"} and ${quizData.weeklyTimeCommitment} hours/week availability suggest other business models would be more suitable for your entrepreneurial journey.`;
      });

      return fallbackDescriptions;
    }
  };

  // Add useRef guard for generateReport
  const hasGeneratedReport = useRef(false);
  const aiPreviewRequestedRef = useRef(false);
  // Remove unique instance ID, early localStorage flag checks, and related logic
  // Restore the effect to its previous, simpler logic

  useEffect(() => {
    let isMounted = true;
    let stepTimeouts: NodeJS.Timeout[] = [];
    let progressInterval: NodeJS.Timeout | null = null;
    let startTime = Date.now();
    let aiDone = false;
    let aiPromiseResolve: (() => void) | null = null;
    const aiPromiseWrapper = new Promise<void>((resolve) => {
      aiPromiseResolve = resolve;
    });

    // Helper to animate progress bar smoothly
    const animateProgress = (target: number, duration: number) => {
      const initial = progress;
      const start = Date.now();
      if (progressInterval) clearInterval(progressInterval);
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const ratio = Math.min(elapsed / duration, 1);
        setProgress(initial + (target - initial) * ratio);
        if (ratio >= 1 && progressInterval) {
          clearInterval(progressInterval);
        }
      }, 30);
    };

    // At the top, set a constant for total loading time
    const TOTAL_LOADING_TIME = 24000; // 24 seconds

    // Step-by-step animation
    const runSteps = async () => {
      startTime = Date.now();
      setCurrentStep(0);
      setCompletedSteps(new Set());
      setProgress(0);
      setIsLoadingComplete(false);
      setTargetProgress(0);
      setSteps(loadingSteps);
      setLoadingResults({});

      // Calculate per-card duration for steps 1-5
      const perCardDuration = 7000; // 7 seconds per card
      let aiDone = false;
      let aiPromiseResolve: (() => void) | null = null;
      const aiPromiseWrapper = new Promise<void>((resolve) => {
        aiPromiseResolve = resolve;
      });

      // Start AI generation in parallel
      const aiPromise = (async () => {
        // Check if AI insights generation is already in progress
        const aiGenerationInProgress = localStorage.getItem(
          "ai-generation-in-progress",
        );
        const flagTimestamp = localStorage.getItem("ai-generation-timestamp");
        const currentTime = Date.now();

        // Clear flag if it's older than 2 minutes (stuck flag)
        if (aiGenerationInProgress === "true" && flagTimestamp) {
          const timeSinceFlag = currentTime - parseInt(flagTimestamp);
          if (timeSinceFlag > 120000) {
            // 2 minutes
            console.log(" Clearing stuck AI generation flag");
            localStorage.removeItem("ai-generation-in-progress");
            localStorage.removeItem("ai-generation-timestamp");
          } else {
            console.log(
              " AI generation already in progress, skipping duplicate call",
            );
            return;
          }
        } else if (aiGenerationInProgress === "true") {
          console.log(
            " AI generation already in progress (no timestamp), skipping duplicate call",
          );
          return;
        }

        // Set flag to prevent duplicate calls
        localStorage.setItem("ai-generation-in-progress", "true");
        localStorage.setItem("ai-generation-timestamp", currentTime.toString());

        const aiStartTime = Date.now();
        let currentAiResults = {};

        // Create fallback quiz data for development mode
        const getFallbackQuizData = (): QuizData => ({
          // Round 1: Motivation & Vision
          mainMotivation: "financial-freedom",
          firstIncomeTimeline: "3-6-months",
          successIncomeGoal: 5000,
          upfrontInvestment: 1000,
          passionIdentityAlignment: 4,
          businessExitPlan: "not-sure",
          businessGrowthSize: "full-time-income",
          passiveIncomeImportance: 3,

          // Round 2: Time, Effort & Learning Style
          weeklyTimeCommitment: 20,
          longTermConsistency: 4,
          trialErrorComfort: 3,
          learningPreference: "hands-on",
          systemsRoutinesEnjoyment: 3,
          discouragementResilience: 4,
          toolLearningWillingness: "yes",
          organizationLevel: 3,
          selfMotivationLevel: 4,
          uncertaintyHandling: 3,
          repetitiveTasksFeeling: "tolerate",
          workCollaborationPreference: "mostly-solo",

          // Round 3: Personality & Preferences
          brandFaceComfort: 3,
          competitivenessLevel: 3,
          creativeWorkEnjoyment: 4,
          directCommunicationEnjoyment: 4,
          workStructurePreference: "some-structure",

          // Round 4: Tools & Work Environment
          techSkillsRating: 3,
          workspaceAvailability: "yes",
          supportSystemStrength: "small-helpful-group",
          internetDeviceReliability: 4,
          familiarTools: ["google-docs-sheets", "canva"],

          // Round 5: Strategy & Decision-Making
          decisionMakingStyle: "after-some-research",
          riskComfortLevel: 3,
          feedbackRejectionResponse: 3,
          pathPreference: "proven-path",
          controlImportance: 4,

          // Round 6: Business Model Fit Filters
          onlinePresenceComfort: "somewhat-comfortable",
          clientCallsComfort: "somewhat-comfortable",
          physicalShippingOpenness: "open-to-it",
          workStylePreference: "structured-flexible-mix",
          socialMediaInterest: 3,
          ecosystemParticipation: "participate-somewhat",
          existingAudience: "none",
          promotingOthersOpenness: "somewhat-open",
          teachVsSolvePreference: "solve-problems",
          meaningfulContributionImportance: 4,
        });

        // Use fallback data if quizData is null/undefined (DEV mode)
        const activeQuizData = quizData || getFallbackQuizData();

        if (!quizData) {
          console.log("Using fallback quiz data for development mode");
        }

        // Before starting AI insights generation (in runSteps or equivalent), add:
        const existingPreview = localStorage.getItem('quiz-completion-ai-insights');
        if (existingPreview) {
          try {
            const parsed = JSON.parse(existingPreview);
            if (parsed && parsed.complete && !parsed.error) {
              console.log('AI preview insights already exist, skipping generation');
              // Optionally set state to use this data
              setAIInsights(parsed.insights);
              return;
            }
          } catch (e) {
            // If parsing fails, proceed to generate
          }
        }

        try {
          // Step 1: Analyze profile (immediate)
          const step1Result = await executeStep(0, async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return { profileAnalyzed: true };
          });
          currentAiResults = { ...currentAiResults, ...step1Result };

          // Step 2: Generate AI-powered personalized paths
          const step2Result = await executeStep(1, async () => {
            // Use the same business model scoring system as Results page
            const { businessModelService } = await import(
              "../utils/businessModelService"
            );
            const businessMatches =
              businessModelService.getBusinessModelMatches(activeQuizData);

            // Convert to BusinessPath format for compatibility
            const paths = businessMatches.slice(0, 7).map((match) => ({
              id: match.id,
              name: match.name,
              description: `${match.name} with ${match.score}% compatibility`,
              detailedDescription: `This business model scored ${match.score}% based on your quiz responses`,
              fitScore: match.score,
              difficulty:
                match.score >= 75
                  ? "Easy"
                  : match.score >= 50
                    ? "Medium"
                    : "Hard",
              timeToProfit:
                match.score >= 80
                  ? "1-3 months"
                  : match.score >= 60
                    ? "3-6 months"
                    : "6+ months",
              monthlyIncomeRange:
                match.score >= 80
                  ? "$1000-$5000"
                  : match.score >= 60
                    ? "$500-$2000"
                    : "$100-$1000",
            }));

            console.log("Using consistent business model scoring, top 3:");
            paths.slice(0, 3).forEach((path, index) => {
              console.log(`${index + 1}. ${path.name} (${path.fitScore}%)`);
            });

            return { personalizedPaths: paths };
          });
          currentAiResults = { ...currentAiResults, ...step2Result };

          // Step 3: Generate AI insights (SINGLE API CALL)
          // Remove any duplicate or redundant call to generateResultsPreview here. Only one call should be made per quiz attempt.
          // The following block is the only call that should remain:
          const step3Result = await executeStep(2, async () => {
            console.log(" Starting AI insights generation (single call)");
            console.log("Quiz data being used:", {
              mainMotivation: activeQuizData.mainMotivation,
              successIncomeGoal: activeQuizData.successIncomeGoal,
              techSkillsRating: activeQuizData.techSkillsRating,
              riskComfortLevel: activeQuizData.riskComfortLevel,
              directCommunicationEnjoyment:
                activeQuizData.directCommunicationEnjoyment,
            });

            const { AIService } = await import("../utils/aiService");
            const aiService = AIService.getInstance();
            const pathsForInsights =
              (currentAiResults as any).personalizedPaths?.slice(0, 3) || [];

            console.log(
              "Paths for insights:",
              pathsForInsights.map((p: any) => `${p.name} (${p.fitScore}%)`),
            );

            // Make PREVIEW-ONLY API call for quiz loading phase
            try {
              console.log(
                " Generating PREVIEW insights ONLY during quiz loading phase (no full report data)",
              );
              const quizAttemptId = localStorage.getItem('currentQuizAttemptId');
              const previewData = await aiService.generateResultsPreview(
                activeQuizData,
                pathsForInsights,
                quizAttemptId,
              );

              console.log(
                "✅ Preview insights generation completed successfully",
              );
              console.log(
                "Generated preview summary:",
                previewData.previewInsights?.substring(0, 100) + "...",
              );

              // Convert preview data to expected format for backward compatibility
              const formattedInsights = {
                personalizedSummary: previewData.previewInsights,
                customRecommendations: previewData.keyInsights,
                potentialChallenges: [], // Not used in preview
                successStrategies: previewData.successPredictors,
                personalizedActionPlan: {
                  week1: ["Complete market research", "Set up basic workspace"],
                  month1: [
                    "Launch minimum viable version",
                    "Gather initial feedback",
                  ],
                  month3: [
                    "Optimize based on feedback",
                    "Scale successful elements",
                  ],
                  month6: ["Expand offerings", "Build team if needed"],
                },
                motivationalMessage:
                  "You have the foundation to build a successful business. Stay consistent and trust the process.",
              };

              // Create proper analysis object using actual API response data
              const properAnalysis = {
                fullAnalysis: previewData.previewInsights,
                keyInsights: previewData.keyInsights,
                personalizedRecommendations: previewData.keyInsights,
                successPredictors: previewData.successPredictors,
                riskFactors: [
                  "Initial learning curve may require patience and persistence",
                  "Income may be inconsistent in the first few months",
                  "Success requires consistent daily action and follow-through",
                ],
              };

              // Store in new 1-hour cache system and database
              const aiCacheManager = AICacheManager.getInstance();

              // Cache for 1-hour session with both insights and analysis
              aiCacheManager.cacheAIContent(
                localStorage.getItem('currentQuizAttemptId') || 'unknown',
                {
                  resultsInsights: formattedInsights,
                  fullReport: properAnalysis,
                }
              );

              setAIInsights({
                insights: formattedInsights,
                analysis: properAnalysis,
                timestamp: Date.now(),
                quizAttemptId: (() => { const id = localStorage.getItem('currentQuizAttemptId'); return id ? parseInt(id) : undefined; })(),
              });

              return { aiInsights: formattedInsights, properAnalysis: properAnalysis };
            } catch (err) {
              console.error('Error generating preview insights:', err);
              return {};
            }
          });
          currentAiResults = { ...currentAiResults, ...step3Result };

          // Step 4: Save Results page content to database
          const step4Result = await executeStep(3, async () => {
            console.log(" Saving Results page content to database");
            
            const quizAttemptId = localStorage.getItem("currentQuizAttemptId");
            if (quizAttemptId) {
              try {
                const { AIService } = await import("../utils/aiService");
                const aiService = AIService.getInstance();
                
                // Save the Results page content
                await aiService.saveAIContentToDatabase(
                  quizAttemptId,
                  "results-preview",
                  {
                    personalizedSummary: (currentAiResults as any).aiInsights?.personalizedSummary,
                    successPredictors: (currentAiResults as any).aiInsights?.successStrategies,
                    keyInsights: (currentAiResults as any).aiInsights?.customRecommendations,
                  }
                );
                console.log("✅ Results page content saved to database");
              } catch (error) {
                console.error("❌ Error saving Results page content to database:", error);
              }
            }
            
            return { saved: true };
          });
          currentAiResults = { ...currentAiResults, ...step4Result };

          // Step 5: Placeholder for business descriptions (will be generated in full-report-loading)
          const step5Result = await executeStep(4, async () => {
            console.log(" Skipping business fit/avoid descriptions - will be generated in full-report-loading");
            return {
              businessFitDescriptions: {}, // Empty - will be generated later
              businessAvoidDescriptions: {}, // Empty - will be generated later
            };
          });
          currentAiResults = { ...currentAiResults, ...step5Result };

          // Step 6: Finalize and store AI data for Results component
          const step6Result = await executeStep(5, async () => {
            // Use the AI insights that were already generated in step 3
            const existingInsights = (currentAiResults as any).aiInsights;

            if (existingInsights) {
              console.log("Storing AI insights for Results component");

              // Store in localStorage for Results component to use
              const aiData = {
                insights: existingInsights,
                analysis: (currentAiResults as any).properAnalysis || null,
                topPaths: (currentAiResults as any).personalizedPaths?.slice(0, 3) || [],
                timestamp: Date.now(),
                complete: true,
                error: false,
              };
              
              console.log("💾 Storing in localStorage:", aiData);
              
              localStorage.setItem(
                "quiz-completion-ai-insights",
                JSON.stringify(aiData),
              );

              console.log(
                "✅ AI data stored successfully for Results component",
              );
              return { finalizedData: true };
            } else {
              console.log("No AI insights found, storing fallback data");

              // Store fallback indicator
              const aiData = {
                insights: null,
                analysis: null,
                topPaths:
                  (currentAiResults as any).personalizedPaths?.slice(0, 3) ||
                  [],
                timestamp: Date.now(),
                complete: false,
                error: true,
              };
              localStorage.setItem(
                "quiz-completion-ai-insights",
                JSON.stringify(aiData),
              );

              return { finalizedData: false };
            }
          });
          currentAiResults = { ...currentAiResults, ...step6Result };

          // Ensure minimum 25 seconds duration to match mobile step timing
          const elapsedTime = Date.now() - aiStartTime;
          const minimumDuration = 25000; // 25 seconds (6 steps × 4.2 seconds)

          if (elapsedTime < minimumDuration) {
            const remainingTime = minimumDuration - elapsedTime;
            await new Promise((resolve) => setTimeout(resolve, remainingTime));
          }

          // Set target progress to 100% only when everything is truly complete
          // setTargetProgress(100); // Removed
          setIsLoadingComplete(true);

          // Clear the generation flag
          localStorage.removeItem("ai-generation-in-progress");
          localStorage.removeItem("ai-generation-timestamp");

          // Mark this report as viewed now that it's been fully loaded
          const quizAttemptId = parseInt(
            localStorage.getItem("currentQuizAttemptId") || "0",
          );
          if (quizAttemptId && quizData) {
            reportViewManager.markReportAsViewed(
              quizAttemptId,
              quizData,
              userEmail,
            );
            console.log(
              `Report for quiz attempt ${quizAttemptId} marked as viewed after AI loading completion`,
            );
          }

          // Complete and pass data to parent
          console.log("🚀 QuizCompletionLoading onComplete - passing data:", {
            personalizedPaths: (currentAiResults as any).personalizedPaths?.length || 0,
            aiInsights: (currentAiResults as any).aiInsights,
          });
          
          onComplete({
            personalizedPaths: (currentAiResults as any).personalizedPaths || [],
            aiInsights: (currentAiResults as any).aiInsights || null,
          });
        } catch (error) {
          console.error("Error generating report:", error);

          // Ensure minimum 25 seconds duration even on error
          const elapsedTime = Date.now() - aiStartTime;
          const minimumDuration = 25000; // 25 seconds

          if (elapsedTime < minimumDuration) {
            const remainingTime = minimumDuration - elapsedTime;
            await new Promise((resolve) => setTimeout(resolve, remainingTime));
          }

          // Set target progress to 100% when complete (even with errors)
          // setTargetProgress(100); // Removed
          setIsLoadingComplete(true);

          // Clear the generation flag even on error
          localStorage.removeItem("ai-generation-in-progress");
          localStorage.removeItem("ai-generation-timestamp");

          // Mark this report as viewed even on error (user saw the loading process)
          const quizAttemptId = parseInt(
            localStorage.getItem("currentQuizAttemptId") || "0",
          );
          if (quizAttemptId && quizData) {
            reportViewManager.markReportAsViewed(
              quizAttemptId,
              quizData,
              userEmail,
            );
            console.log(
              `Report for quiz attempt ${quizAttemptId} marked as viewed after AI loading completion (with errors)`,
            );
          }

          // In case of error, still complete with current data
          onComplete({
            personalizedPaths:
              (currentAiResults as any).personalizedPaths || [],
            aiInsights: (currentAiResults as any).aiInsights || null,
          });
        }
      })();

      for (let i = 0; i < loadingSteps.length; i++) {
        if (!isMounted) return;
        setCurrentStep(i);
        setSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx === i ? "active" : idx < i ? "completed" : "pending",
          })),
        );
        if (i < loadingSteps.length - 1) {
          // Steps 1-5: normal duration
          await new Promise((resolve) => {
            const timeout = setTimeout(resolve, perCardDuration);
            stepTimeouts.push(timeout);
          });
          setCompletedSteps((prev) => new Set([...Array.from(prev), i]));
        } else {
          // Step 6: wait for AI if not done, otherwise proceed immediately
          setCompletedSteps((prev) => new Set([...Array.from(prev), i]));
          if (!aiDone) {
            await aiPromiseWrapper;
          }
        }
      }

      // Wait for AI to finish if not done (should be instant now)
      await aiPromise;

      // Animate to 100% and rest for <1s
      setTimeout(() => {
        setIsLoadingComplete(true);
        if (typeof onComplete === "function") {
          onComplete(loadingResults);
        }
      }, 700);
    };

    runSteps();

    return () => {
      isMounted = false;
      aiPreviewRequestedRef.current = false;
      stepTimeouts.forEach(clearTimeout);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [quizData]);

  const executeStep = async (
    stepIndex: number,
    asyncFunction: () => Promise<any>,
  ) => {
    // Do not update currentStep, setSteps, or setCompletedSteps here
    try {
      const result = await asyncFunction();
      // Store result
      setLoadingResults((prev: any) => ({ ...prev, ...result }));
      return result;
    } catch (error) {
      console.error(`Error in step ${stepIndex}:`, error);
      return {};
    }
  };

  const getStepIcon = (step: LoadingStep, index: number) => {
    const IconComponent = step.icon;

    if (step.status === "completed") {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }

    if (step.status === "active") {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <IconComponent className="h-6 w-6 text-blue-500" />
        </motion.div>
      );
    }

    return <IconComponent className="h-6 w-6 text-gray-400" />;
  };

  // Track the maximum progress reached so far to prevent flicker or decrease
  useEffect(() => {
    setMaxProgress((prev) => Math.max(prev, progress));
  }, [progress]);

  // Always display the max progress reached so far, clamped and rounded
  const displayProgress = Math.round(Math.max(0, Math.min(100, maxProgress)));

  // --- BEGIN NEW VISUAL LAYOUT ---
  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-4xl mx-auto px-4 relative pt-12">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center"
              animate={isLoadingComplete ? { scale: 1, rotate: 0 } : { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: isLoadingComplete ? 0 : Infinity, ease: "easeInOut" }}
            >
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI is Creating Your Personalized Report
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our advanced AI is analyzing your responses and generating custom insights just for you. This will take about 15-30 seconds.
          </p>
        </motion.div>

        {/* Progress Bar - show at the top for mobile, inside card for desktop */}
        {isMobile ? (
          <div className="w-full max-w-xs mx-auto mb-6">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.3, ease: "linear", type: "tween" }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Loading</span>
              <span>{displayProgress}%</span>
            </div>
          </div>
        ) : (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-900">{displayProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.3, ease: "linear", type: "tween" }}
                />
              </div>
            </div>
          </motion.div>
        )}
        {/* Compact Loading Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2 md:mb-6">
          {isMobile ? (
            <div style={{ minHeight: 160 }} className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[currentMobileStep].id}
                  className={`bg-gray-50 rounded-xl p-4 shadow-sm transition-all duration-300 w-full` +
                    (steps[currentMobileStep].status === "active"
                      ? " ring-2 ring-blue-500 bg-blue-50"
                      : steps[currentMobileStep].status === "completed"
                      ? " ring-2 ring-green-500 bg-green-50"
                      : " ring-1 ring-gray-200")}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
                >
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 mr-3">
                      {getStepIcon(steps[currentMobileStep], currentMobileStep)}
                    </div>
                    {steps[currentMobileStep].status === "active" && !isLoadingComplete && (
                      <motion.div
                        className="flex space-x-1 ml-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[0, 1, 2].map((dot) => (
                          <motion.div
                            key={dot}
                            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: dot * 0.2,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      steps[currentMobileStep].status === "active"
                        ? "text-blue-900"
                        : steps[currentMobileStep].status === "completed"
                        ? "text-green-900"
                        : "text-gray-700"
                    }`}
                  >
                    {steps[currentMobileStep].title}
                  </h3>
                  <p
                    className={`text-sm ${
                      steps[currentMobileStep].status === "active"
                        ? "text-blue-600"
                        : steps[currentMobileStep].status === "completed"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {steps[currentMobileStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            // Desktop: Show all cards
            steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`bg-gray-50 rounded-xl p-4 shadow-sm transition-all duration-300 ${
                  step.status === "active"
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : step.status === "completed"
                      ? "ring-2 ring-green-500 bg-green-50"
                      : "ring-1 ring-gray-200"
                }`}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 mr-3">
                    {getStepIcon(step, index)}
                  </div>
                  {step.status === "active" && !isLoadingComplete && (
                    <motion.div
                      className="flex space-x-1 ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: dot * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    step.status === "active"
                      ? "text-blue-900"
                      : step.status === "completed"
                        ? "text-green-900"
                        : "text-gray-700"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    step.status === "active"
                      ? "text-blue-600"
                      : step.status === "completed"
                        ? "text-green-600"
                        : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Fun Facts / Did you know block at the bottom */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-4 shadow-sm mt-2 md:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-2">
                            <span className="text-yellow-500 text-xl mr-2 emoji">💡</span>
            <span className="font-semibold text-lg">Did you know?</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-start">
                              <span className="text-2xl mr-2 emoji">🧠</span>
              <span>Our AI analyzes over 50 different personality traits and business factors to find your perfect match.</span>
            </div>
            <div className="flex items-start">
                              <span className="text-2xl mr-2 emoji">🎯</span>
              <span>Your personalized report is unique to you – no two reports are exactly the same!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
  // --- END NEW VISUAL LAYOUT ---
};

export default QuizCompletionLoading;
