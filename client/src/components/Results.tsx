import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle2,
  Lock,
  Award,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  ArrowRight,
  X,
  Brain,
  Sparkles,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Rocket,
  FileText,
  CreditCard,
  Eye,
  EyeOff,
  Download,
  Mail,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QuizData, BusinessPath, AIAnalysis } from "../types";
import {
  generateAIPersonalizedPaths,
} from "../utils/quizLogic";
import { businessModelService } from '../utils/businessModelService';
import { AIService } from "../utils/aiService";
import { aiCacheManager } from "../utils/aiCacheManager";
import FullReport from "./FullReport";

import FullReportLoadingPage from "./FullReportLoadingPage";
import QuizCompletionLoading from "./QuizCompletionLoading";
import { PaywallModal, LockedCardOverlay } from "./PaywallModals";
import { PaymentAccountModal } from "./PaymentAccountModal";
import { usePaywall } from "../contexts/PaywallContext";
import { useAuth } from "../contexts/AuthContext";
import { renderMarkdownContent } from "../utils/markdownUtils";
import { ReportUnlockPaywall } from "./ReportUnlockPaywall";
import { useReportUnlock } from "../hooks/useReportUnlock";
import EmailResultsModal from "./EmailResultsModal";
import { reportViewManager } from "../utils/reportViewManager";
import { businessPaths } from "../../../shared/businessPaths";
import { getSafeEmoji } from '../utils/contentUtils';
import { useBusinessModelScores } from "../contexts/BusinessModelScoresContext";
import { API_ROUTES, apiPost } from '../utils/apiClient';
import { useAIInsights } from '../contexts/AIInsightsContext';
import { useEmojiSafeguard } from "../hooks/useEmojiSafeguard";
import '../styles/BusinessCard.css';

// Helper function to generate 2-sentence descriptions for business models
const getBusinessModelDescription = (
  businessId: string,
  businessName: string,
): string => {
  const descriptions: Record<string, string> = {
    freelancing:
      "Offer your specialized skills and services to clients on a project-by-project basis, working independently with complete schedule flexibility. Perfect for skilled professionals who want to monetize their expertise while maintaining control over their workload and client relationships.",
    "affiliate-marketing":
      "Promote other companies' products and earn commissions on every sale you generate through your unique referral links. This performance-based model lets you build passive income streams by recommending products you genuinely believe in to your audience.",
    "content-creation":
      "Create engaging videos, photos, blogs, or social media content for brands or build your own following to monetize through sponsorships and partnerships. This creative path allows you to turn your personality, expertise, or interests into a profitable personal brand.",
    "social-media-agency":
      "Help businesses grow their online presence by managing their social media accounts, creating content, and running advertising campaigns. You'll combine creativity with strategic thinking to deliver measurable results for clients across various industries.",
    "online-coaching":
      "Share your knowledge and expertise by teaching others through one-on-one sessions, group classes, or online courses. This rewarding path lets you make a meaningful impact while building a scalable education business around subjects you're passionate about.",

    "local-service":
      "Provide essential services to businesses and homeowners in your local area, from cleaning and maintenance to specialized professional services. This model offers steady demand, repeat customers, and the satisfaction of serving your immediate community.",
    "ai-marketing-agency":
      "Leverage artificial intelligence tools to provide cutting-edge marketing solutions for businesses, from automated content creation to predictive analytics. This emerging field combines technical innovation with marketing expertise to deliver superior results for clients.",
    copywriting:
      "Create persuasive written content that drives sales and engagement for businesses, from email campaigns to website copy and advertisements. This high-demand skill allows you to work with diverse clients while building a reputation for delivering measurable results.",
    "youtube-automation":
      "Build and monetize YouTube channels using systematic content creation and optimization strategies, often with minimal on-camera presence. This scalable approach can generate passive income through ad revenue, sponsorships, and product sales.",
    "virtual-assistant":
      "Provide administrative, technical, or creative support services to entrepreneurs and businesses remotely, helping them focus on their core activities. This flexible role offers steady work opportunities with the potential to specialize in high-value niches.",
    "high-ticket-sales":
      "Sell premium products or services with substantial commission potential, typically involving consultative sales processes and relationship building. This model rewards strong communication skills and relationship-building abilities with high per-transaction earnings.",
    "saas-development":
      "Develop software applications that solve specific problems for businesses or consumers, generating recurring revenue through subscription models. This technical path offers high scalability potential and the satisfaction of building solutions that make a real difference.",
    "digital-services":
      "Provide specialized digital services like web development, graphic design, or digital marketing to businesses looking to enhance their online presence. This broad category allows you to leverage technical skills while working with diverse clients across industries.",
    "investing-trading":
      "Generate returns through strategic investment in stocks, cryptocurrency, real estate, or other financial instruments using analysis and market timing. This path requires financial knowledge and risk management skills but offers potential for significant passive income.",
  };

  return (
    descriptions[businessId] ||
    `${businessName} offers a unique opportunity to build a profitable business by leveraging your skills and interests. This model provides flexibility and growth potential while allowing you to work on your own terms.`
  );
};

interface ResultsProps {
  quizData: QuizData;
  onBack: () => void;
  userEmail?: string | null;
  preloadedReportData?: any;
}

interface AIInsights {
  personalizedSummary: string;
  customRecommendations: string[];
  potentialChallenges: string[];
  successStrategies: string[];
  personalizedActionPlan: {
    week1: string[];
    month1: string[];
    month3: string[];
    month6: string[];
  };
  motivationalMessage: string;
}

// Move or define generateFallbackAnalysis above the AI Analysis Section so it is in scope for fallback rendering.
const generateFallbackAnalysis = (): AIInsights => {
  return {
    personalizedSummary:
      "Complete your quiz to receive a personalized business analysis.",
    customRecommendations: ["Take the business assessment quiz"],
    potentialChallenges: ["Assessment required"],
    successStrategies: ["Complete quiz first"],
    personalizedActionPlan: {
      week1: ["Take business assessment"],
      month1: ["Complete evaluation"],
      month3: ["Get personalized plan"],
      month6: ["Receive detailed roadmap"],
    },
    motivationalMessage:
      "Start your entrepreneurial journey by completing our comprehensive business assessment!",
  };
};

// Helper to generate a realistic fallback AI summary from quizData
function generatePersonalizedFallbackSummary(quizData: QuizData): string[] {
  if (!quizData) {
    return [
      "We couldn't generate a personalized analysis at this time. Please try again later or contact support if this persists.",
      "",
      ""
    ];
  }
  const motivation = quizData.mainMotivation?.replace(/-/g, ' ') || 'your goals';
  const time = quizData.weeklyTimeCommitment ? `${quizData.weeklyTimeCommitment} hours/week` : 'your available time';
  const tech = quizData.techSkillsRating !== undefined ? (quizData.techSkillsRating >= 4 ? 'strong technical skills' : 'developing technical skills') : 'your skills';
  const risk = quizData.riskComfortLevel !== undefined ? (quizData.riskComfortLevel >= 4 ? 'high risk tolerance' : 'moderate risk comfort') : 'your risk profile';
  const structure = quizData.workStructurePreference?.replace(/-/g, ' ') || 'your preferred work style';
  const learning = quizData.learningPreference?.replace(/-/g, ' ') || 'your learning style';
  const investment = quizData.upfrontInvestment !== undefined ? `$${quizData.upfrontInvestment}` : 'your available investment';
  const goal = quizData.successIncomeGoal !== undefined ? `$${quizData.successIncomeGoal}/month` : 'your income goal';

  return [
    `Based on your responses, your primary motivation is ${motivation}, and you are prepared to dedicate ${time} to your business journey. Your ${tech} and ${risk} position you well for opportunities that require adaptability and resilience.`,
    `You prefer a ${structure} and learn best through ${learning}. With an initial investment of ${investment} and a target income of ${goal}, you are focused on building a business that aligns with your lifestyle and financial ambitions.`,
    `To maximize your success, consider leveraging your strengths and addressing any skill gaps through continuous learning. Stay consistent, set clear milestones, and remember that progress comes from steady action. Your personalized business path is designed to help you achieve your goals with confidence.`
  ];
}

const Results: React.FC<ResultsProps> = ({ quizData, onBack, userEmail }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Support deep-linking by quizAttemptId from URL
  const [quizAttemptId, setQuizAttemptId] = useState<number | null>(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const idFromUrl = params.get("quizAttemptId");
    if (idFromUrl) return parseInt(idFromUrl);
    const stored = localStorage.getItem("currentQuizAttemptId");
    return stored ? parseInt(stored) : null;
  });

  // If quizAttemptId is present in URL, fetch quiz data for that attempt
  const [quizDataState, setQuizDataState] = useState<QuizData | null>(null);
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const idFromUrl = params.get("quizAttemptId");
    if (idFromUrl) {
      const attemptId = parseInt(idFromUrl);
      if (!isNaN(attemptId)) {
        fetch(`/api/quiz-attempts/attempt/${attemptId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.quizData) {
              setQuizDataState(data.quizData);
              setQuizAttemptId(attemptId);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch quiz attempt by ID:", err);
          });
      }
    }
  }, []);

  // Use the new report unlock hook with lazy loading
  const {
    isUnlocked: isReportUnlocked,
    isLoading: isCheckingUnlock,
    refresh: refreshUnlockStatus,
  } = useReportUnlock(quizAttemptId);
  
  // Add loading state for better UX - start with false to show content immediately
  const [isInitializing, setIsInitializing] = useState(false);
  const [selectedPath, setSelectedPath] = useState<BusinessPath | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  const [showAILoading, setShowAILoading] = useState(false);
  const [showFullReportLoading, setShowFullReportLoading] = useState(false);
  const [loadedReportData, setLoadedReportData] = useState<any>(null);
  const [hasLoadedFullReport, setHasLoadedFullReport] = useState(false);
  const [personalizedPaths, setPersonalizedPaths] = useState<BusinessPath[]>(
    [],
  );
  // Initialize with null, will be set in useEffect with fallback content
  const [showAIInsights, setShowAIInsights] = useState(false);

  const [showPreview, setShowPreview] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paywallType, setPaywallType] = useState<
    "business-model" | "learn-more" | "full-report"
  >("business-model");
  const [pendingAction, setPendingAction] = useState<
    "download" | "share" | null
  >(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingFullReportRequest, setPendingFullReportRequest] = useState(false);

  const { user, isRealUser } = useAuth();

  const {
    hasUnlockedAnalysis,
    hasCompletedQuiz,
    setHasUnlockedAnalysis,
    setHasCompletedQuiz,
    canAccessFullReport,
    hasMadeAnyPayment,
  } = usePaywall();

  // Use centralized business model scores from context
  const { scores: businessModelScores, calculateAndStoreScores } = useBusinessModelScores();

  // In pure pay-per-report model, check if this specific report is unlocked
  // Basic access is always available, but full reports require payment
  const canViewFullReport = !!user && isReportUnlocked;

  const { aiInsights, setAIInsights } = useAIInsights();
  const analysisData = aiInsights?.analysis;
  const insightsData = aiInsights?.insights;
  const shouldShowFallback = !analysisData && !!insightsData;

  // Debug logging
  console.log("🔍 Results page AI insights debug:", {
    aiInsights: aiInsights,
    analysisData: analysisData,
    insightsData: insightsData,
    shouldShowFallback: shouldShowFallback,
    hasAnalysis: !!analysisData,
    hasInsights: !!insightsData,
    localStorageData: localStorage.getItem('quiz-completion-ai-insights')
  });

  // Fallback: Check if AI insights exist in localStorage but not in context
  useEffect(() => {
    if (!aiInsights) {
      const storedInsights = localStorage.getItem('quiz-completion-ai-insights');
      if (storedInsights) {
        try {
          const parsed = JSON.parse(storedInsights);
          if (parsed && parsed.insights && !parsed.error) {
            // Convert the old format to the new format expected by the context
            const convertedData = {
              insights: parsed.insights,
              analysis: {
                fullAnalysis: parsed.insights.personalizedSummary || "Analysis not available",
                keyInsights: parsed.insights.customRecommendations || [],
                personalizedRecommendations: parsed.insights.customRecommendations || [],
                successPredictors: parsed.insights.successStrategies || [],
                riskFactors: ["Initial learning curve", "Income variability", "Time commitment required"],
              },
              timestamp: parsed.timestamp || Date.now(),
              quizAttemptId: parsed.quizAttemptId,
            };
            
            // Update the context with the loaded data
            setAIInsights(convertedData);
          }
        } catch (error) {
          console.error("Error parsing stored AI insights:", error);
        }
      }
    }
  }, [aiInsights, setAIInsights]);

  const { validateAndFixEmoji } = useEmojiSafeguard();

  useEffect(() => {
    async function initializeResults() {
      try {
        console.log("Starting Results initialization...");
        
        // Check for showFullReport URL parameter
        const showFullReportParam = searchParams.get("showFullReport");
        if (showFullReportParam === "true") {
          console.log("showFullReport URL parameter detected, handling full report access");
          console.log("Current quizData:", quizData);
          console.log("Current businessModelScores:", businessModelScores);
          // Clear the URL parameter to prevent issues on refresh
          navigate("/results", { replace: true });
          // Set flag to handle full report access after paths are loaded
          setPendingFullReportRequest(true);
        }
        
        // Set loading state immediately
        setIsInitializing(true);
        
        // Minimal localStorage cleanup - only remove problematic keys
        const specificKeys = [
          "ai-generation-in-progress",
          "ai-generation-timestamp",
          "ai-cache-reset-timestamp",
        ];
        specificKeys.forEach((key) => localStorage.removeItem(key));

        // Trigger confetti blast only on first visit to results page
        const confettiKey = `confetti_shown_${userEmail || "anonymous"}`;
        const hasShownConfetti = localStorage.getItem(confettiKey);

        if (!hasShownConfetti) {
          const triggerConfetti = () => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          };

          // Small delay to ensure page is mounted
          setTimeout(triggerConfetti, 500);

          // Mark confetti as shown for this user
          localStorage.setItem(confettiKey, "true");
        }

        // Use centralized business model scores from context
        // If scores don't exist, calculate them once and store
        let advancedScores = businessModelScores || [];
        console.log("Current business model scores:", businessModelScores);
        
        if (!businessModelScores) {
          console.log("No business model scores found, calculating...");
          // Calculate scores in background without blocking UI
          calculateAndStoreScores(quizData, quizAttemptId || undefined).then(() => {
            console.log("Business model scores calculated successfully");
            // Scores will be updated via context
          }).catch((error) => {
            console.error("Error calculating business model scores:", error);
          });
          
          // Use fallback data while scores are being calculated
          advancedScores = [
            {
              id: "content-creation",
              name: "Content Creation",
              score: 85,
              category: "Creative"
            }
          ];
          console.log("Using fallback scores:", advancedScores);
        }

        // Convert to BusinessPath format for compatibility
        const convertedPaths: BusinessPath[] = advancedScores.map((score) => {
          // Normalize the ID
          const normalizedId = score.id.trim().toLowerCase();
          // Find the corresponding business path data
          const businessPathData = businessPaths.find(bp => bp.id === normalizedId);
          
          return {
            id: normalizedId,
            name: score.name,
            description: getBusinessModelDescription(normalizedId, score.name),
            detailedDescription: `${score.name} with ${score.score}% compatibility`,
            fitScore: score.score,
            difficulty: score.score >= 75 ? "Easy" : score.score >= 50 ? "Medium" : "Hard",
            timeToProfit: score.score >= 80 ? "1-3 months" : score.score >= 60 ? "3-6 months" : "6+ months",
            startupCost: score.score >= 70 ? "$0-500" : score.score >= 50 ? "$500-2000" : "$2000+",
            potentialIncome: score.score >= 80 ? "$3K-10K+/month" : score.score >= 60 ? "$1K-5K/month" : "$500-2K/month",
            pros: businessPathData?.pros || [
              `${score.score}% compatibility match`,
              `${score.category} for your profile`,
              "Personalized recommendations",
            ],
            cons: businessPathData?.cons || (score.score < 70 ? ["Lower compatibility score", "May require skill development"] : ["Minor adjustments needed"]),
            tools: businessPathData?.tools || [
              "Standard business tools",
              "Communication platforms",
              "Analytics tools",
            ],
            skills: businessPathData?.skills || ["Basic business skills", "Communication", "Organization"],
            icon: businessPathData?.icon || "",
            emoji: getSafeEmoji(normalizedId),
            marketSize: businessPathData?.marketSize || "Large",
            averageIncome: businessPathData?.averageIncome || {
              beginner: "$1K-3K",
              intermediate: "$3K-8K",
              advanced: "$8K-20K+",
            },
            userStruggles: businessPathData?.userStruggles || ["Getting started", "Finding clients", "Scaling up"],
            solutions: businessPathData?.solutions || [
              "Step-by-step guidance",
              "Proven frameworks",
              "Community support",
            ],
            bestFitPersonality: businessPathData?.bestFitPersonality || ["Motivated", "Organized", "Goal-oriented"],
            resources: businessPathData?.resources || {
              platforms: ["LinkedIn", "Website", "Social Media"],
              learning: ["Online courses", "Books", "Mentorship"],
              tools: ["CRM", "Analytics", "Communication"],
            },
            actionPlan: businessPathData?.actionPlan || {
              phase1: [
                "Setup basic infrastructure",
                "Define target market",
                "Create initial offerings",
              ],
              phase2: [
                "Launch marketing campaigns",
                "Build client base",
                "Optimize processes",
              ],
              phase3: ["Scale operations", "Expand services", "Build team"],
            },
          };
        });

        // After mapping advancedScores to convertedPaths, filter out duplicates by id:
        const uniquePaths = convertedPaths.filter((path, index, self) =>
          index === self.findIndex(p => p.id === path.id)
        );
        setPersonalizedPaths(uniquePaths);

        // Mark quiz as completed
        setHasCompletedQuiz(true);
        
        // Complete initialization
        setIsInitializing(false);
        console.log("Results initialization completed successfully");
        
        // Check if AI insights are needed
        if (!aiInsights && !insightsData) {
          console.log("No AI insights available, triggering AI loading");
          setShowAILoading(true);
        }
        
        // Handle pending full report request if paths are loaded
        if (pendingFullReportRequest && uniquePaths.length > 0) {
          console.log("Handling pending full report request");
          setPendingFullReportRequest(false);
          // Use setTimeout to ensure state updates are processed
          setTimeout(() => {
            handleViewFullReport(uniquePaths[0]);
          }, 100);
        }
      } catch (error) {
        console.error("Error during Results initialization:", error);
        setIsInitializing(false);
      }
    }

    // Increase timeout to 30 seconds for robustness
    const timeoutId = setTimeout(() => {
      console.log("Results initialization timeout - forcing completion");
      setIsInitializing(false);
    }, 30000); // 30 second timeout

    // Use quizDataState if loaded from deep link, otherwise use prop
    const dataToUse = quizDataState || quizData;
    if (!dataToUse) return;
    initializeResults();

    return () => clearTimeout(timeoutId);
  }, [quizData, quizDataState, setHasCompletedQuiz, businessModelScores, calculateAndStoreScores, quizAttemptId, userEmail]);

  // --- Robust fallback for missing data ---
  // If required data is missing, try to reload from localStorage before showing Session Expired
  useEffect(() => {
    // quizData is a prop, so we cannot set it here
    if (!quizAttemptId) {
      const savedAttemptId = localStorage.getItem("currentQuizAttemptId");
      if (savedAttemptId) {
        setQuizAttemptId(parseInt(savedAttemptId));
      }
    }
  }, [quizAttemptId]);

  // Handle pending full report request when paths are available
  useEffect(() => {
    if (pendingFullReportRequest && personalizedPaths.length > 0 && !isInitializing) {
      console.log("Handling pending full report request from useEffect");
      setPendingFullReportRequest(false);
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        console.log("Calling handleViewFullReport with path:", personalizedPaths[0]);
        handleViewFullReport(personalizedPaths[0]);
      }, 100);
    }
  }, [pendingFullReportRequest, personalizedPaths, isInitializing]);

  // Handle pending full report request when business model scores are loaded
  useEffect(() => {
    console.log("useEffect triggered - pendingFullReportRequest:", pendingFullReportRequest, "businessModelScores:", businessModelScores?.length, "isInitializing:", isInitializing);
    if (pendingFullReportRequest && businessModelScores && businessModelScores.length > 0 && !isInitializing) {
      console.log("Handling pending full report request from business model scores");
      setPendingFullReportRequest(false);
      // Convert scores to paths and handle full report
      const convertedPaths: BusinessPath[] = businessModelScores.map((score) => {
        const normalizedId = score.id.trim().toLowerCase();
        const businessPathData = businessPaths.find(bp => bp.id === normalizedId);
        
        return {
          id: normalizedId,
          name: score.name,
          description: getBusinessModelDescription(normalizedId, score.name),
          detailedDescription: `${score.name} with ${score.score}% compatibility`,
          fitScore: score.score,
          difficulty: score.score >= 75 ? "Easy" : score.score >= 50 ? "Medium" : "Hard",
          timeToProfit: score.score >= 80 ? "1-3 months" : score.score >= 60 ? "3-6 months" : "6+ months",
          startupCost: score.score >= 70 ? "$0-500" : score.score >= 50 ? "$500-2000" : "$2000+",
          potentialIncome: score.score >= 80 ? "$3K-10K+/month" : score.score >= 60 ? "$1K-5K/month" : "$500-2K/month",
          pros: businessPathData?.pros || [
            `${score.score}% compatibility match`,
            `${score.category} for your profile`,
            "Personalized recommendations",
          ],
          cons: businessPathData?.cons || (score.score < 70 ? ["Lower compatibility score", "May require skill development"] : ["Minor adjustments needed"]),
          tools: businessPathData?.tools || [
            "Standard business tools",
            "Communication platforms",
            "Analytics tools",
          ],
          skills: businessPathData?.skills || ["Basic business skills", "Communication", "Organization"],
          icon: businessPathData?.icon || "",
          emoji: getSafeEmoji(normalizedId),
          marketSize: businessPathData?.marketSize || "Large",
          averageIncome: businessPathData?.averageIncome || {
            beginner: "$1K-3K",
            intermediate: "$3K-8K",
            advanced: "$8K-20K+",
          },
          userStruggles: businessPathData?.userStruggles || ["Getting started", "Finding clients", "Scaling up"],
          solutions: businessPathData?.solutions || [
            "Step-by-step guidance",
            "Proven frameworks",
            "Community support",
          ],
          bestFitPersonality: businessPathData?.bestFitPersonality || ["Motivated", "Organized", "Goal-oriented"],
          resources: businessPathData?.resources || {
            platforms: ["LinkedIn", "Website", "Social Media"],
            learning: ["Online courses", "Books", "Mentorship"],
            tools: ["CRM", "Analytics", "Communication"],
          },
          actionPlan: businessPathData?.actionPlan || {
            phase1: [
              "Setup basic infrastructure",
              "Define target market",
              "Create initial offerings",
            ],
            phase2: [
              "Launch marketing campaigns",
              "Build client base",
              "Optimize processes",
            ],
            phase3: ["Scale operations", "Expand services", "Build team"],
          },
        };
      });

      const uniquePaths = convertedPaths.filter((path, index, self) =>
        index === self.findIndex(p => p.id === path.id)
      );

      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        console.log("Calling handleViewFullReport with converted path:", uniquePaths[0]);
        handleViewFullReport(uniquePaths[0]);
      }, 100);
    }
  }, [pendingFullReportRequest, businessModelScores, isInitializing]);

  // This function is no longer used - AI content comes from loading page
  const generateAIContent = async (paths: BusinessPath[]) => {
    // No need to use console.log here as per instructions
  };

  // Helper function to execute download action (PDF)
  const executeDownloadAction = async () => {
    try {
      const userEmail = user?.email || localStorage.getItem("userEmail") || "user@example.com";
      // Use the type-safe apiPost, but get the raw response for file download
      const response = await fetch(API_ROUTES.GENERATE_PDF, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizData: quizData,
          userEmail: userEmail,
          aiAnalysis: aiInsights?.analysis || undefined,
          topBusinessPath: personalizedPaths[0] || undefined,
        }),
      });
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "business-report.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // No user feedback per instructions
    }
  };

  // Helper function to execute share action
  const executeShareAction = async () => {
    const topPath = personalizedPaths[0];
    if (!topPath) return;
    const shareData = {
      title: `My Business Path Results - ${topPath.name}`,
      text: `I just discovered my perfect business match! ${topPath.name} is a ${topPath.fitScore}% fit for my goals and personality.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      try {
        await navigator.clipboard.writeText(shareText);
      } catch (e) {}
    }
  };

  // Update generateFallbackInsights to use topPath (personalizedPaths[0]) for all fallback fields
  const generateFallbackInsights = (topPath?: BusinessPath): AIInsights => {
    const actualTopPath = topPath || personalizedPaths[0];
    if (!actualTopPath) {
      return {
        personalizedSummary: "Complete your quiz to receive a personalized business analysis.",
        customRecommendations: ["Take the business assessment quiz"],
        potentialChallenges: ["Assessment required"],
        successStrategies: ["Complete quiz first"],
        personalizedActionPlan: {
          week1: ["Take business assessment"],
          month1: ["Complete evaluation"],
          month3: ["Get personalized plan"],
          month6: ["Receive detailed roadmap"],
        },
        motivationalMessage: "Start your entrepreneurial journey by completing our comprehensive business assessment!",
      };
    }
    return {
      personalizedSummary: `Based on your comprehensive assessment, ${actualTopPath.name} achieves a ${actualTopPath.fitScore || 85}% compatibility score with your unique profile. This business model aligns with your goals, skills, and preferences, making it a strong fit for your entrepreneurial journey.`,
      customRecommendations: [
        `Leverage your strengths to excel in ${actualTopPath.name}`,
        "Start with free tools to validate your concept",
        "Focus on building one core skill deeply",
        "Set realistic 90-day milestones",
        "Join online communities for support",
      ],
      potentialChallenges: [
        `Initial learning curve in ${actualTopPath.name} may require patience and persistence`,
        "Income may be inconsistent in the first few months",
        "Success requires consistent daily action and follow-through",
      ],
      successStrategies: [
        `Your compatibility with ${actualTopPath.name} suggests a high likelihood of follow-through`,
        "Analytical approach will help optimize strategies and tactics",
        "Realistic expectations set foundation for sustainable growth",
      ],
      personalizedActionPlan: {
        week1: [
          `Research key success factors for ${actualTopPath.name}`,
          "Set up basic workspace",
        ],
        month1: [
          `Launch a minimum viable version of your ${actualTopPath.name} business`,
          "Gather initial feedback",
        ],
        month3: [
          "Optimize based on feedback",
          "Scale successful elements",
        ],
        month6: [
          "Expand offerings",
          "Build team if needed",
        ],
      },
      motivationalMessage: `You have the foundation to build a successful ${actualTopPath.name} business. Stay consistent and trust the process!`,
    };
  };

  const handleViewFullReport = async (path: BusinessPath) => {
    console.log("handleViewFullReport called with path:", path);
    console.log("canAccessFullReport():", canAccessFullReport());
    
    if (!canAccessFullReport()) {
      console.log("User cannot access full report, showing paywall");
      setSelectedPath(path);
      setPaywallType("full-report");
      setShowUnlockModal(true);
      return;
    }

    // Check if this report has been viewed before
    const hasBeenViewed =
      quizAttemptId &&
      reportViewManager.hasViewedReport(quizAttemptId, quizData, userEmail);

    // Check if we have AI content available
    const hasAIContent = loadedReportData || hasBeenViewed;

    // Show full report loading page only if this is the first time loading the full report
    if (!hasLoadedFullReport && !hasAIContent) {
      console.log("First time loading full report, showing full report loading page");
      setShowFullReportLoading(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      // If we have preloaded data or have viewed before, go directly to the full report
      setShowFullReport(true);
      // Scroll to top of page immediately and then again after DOM update
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  };

  const handleLearnMore = (path: BusinessPath) => {
    // If user has already unlocked analysis, navigate directly to business model detail page
    if (hasUnlockedAnalysis) {
      navigate(`/business-model/${path.id}`);
      // Scroll to top immediately after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 0);
    } else {
      // Otherwise, show the paywall modal
      setSelectedPath(path);
      setPaywallType("learn-more");
      setShowUnlockModal(true);
    }
  };

  const handleStartBusinessModel = (path: BusinessPath) => {
    // If user has already unlocked analysis, navigate directly to guide page
    if (hasUnlockedAnalysis) {
      navigate(`/guide/${path.id}`);
      // Scroll to top immediately after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 0);
    } else {
      // Otherwise, show the paywall modal
      setSelectedPath(path);
      setPaywallType("business-model");
      setShowUnlockModal(true);
    }
  };

  const handleUnlockAnalysis = () => {
    setPaywallType("full-report");
    setShowUnlockModal(true);
  };

  const handleAILoadingComplete = (data: any) => {
    console.log("QuizCompletionLoading completed with data:", data);
    // Store the AI insights in context
    if (data.aiInsights) {
      setAIInsights({
        insights: data.aiInsights,
        analysis: {
          fullAnalysis: data.aiInsights.personalizedSummary,
          keyInsights: data.aiInsights.customRecommendations,
          personalizedRecommendations: data.aiInsights.customRecommendations,
          successPredictors: data.aiInsights.successStrategies,
          riskFactors: [],
        },
        timestamp: Date.now(),
        quizAttemptId: quizAttemptId || undefined,
      });
    }
    setShowAILoading(false);
  };



  // Payment state and logic centralized for robustness and type safety
  type PaywallType = "business-model" | "learn-more" | "full-report";
  type PendingAction = "download" | "share" | null;

  // Centralized payment handler
  const handlePayment = async (action: PendingAction = null, type: PaywallType = "full-report", path: BusinessPath | null = null) => {
    setShowUnlockModal(true);
    setShowPaymentModal(false);
    setPaywallType(type);
    setPendingAction(action);
    setSelectedPath(path);
  };

  // Centralized payment success handler
  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    
    // Force refresh unlock status
    await refreshUnlockStatus();
    
    // Set flags to indicate payment was successful
    setHasUnlockedAnalysis(true);
    localStorage.setItem("hasAnyPayment", "true");
    localStorage.setItem("hasUnlockedAnalysis", "true");
    
    // Clear business model AI content for new paid report
    if (user && user.id && !String(user.id).startsWith("temp_")) {
      try {
        const aiService = AIService.getInstance();
        await aiService.clearBusinessModelAIContent(parseInt(String(user.id)));
        console.log("🧹 Cleared business model AI content for new paid report");
      } catch (error) {
        console.error("Error clearing business model AI content:", error);
      }
    }
    
    // Handle immediate navigation based on paywall type and selected path
    if (selectedPath) {
      const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 100);
      };

      if (paywallType === "full-report") {
        setShowFullReportLoading(true);
        handleViewFullReport(selectedPath);
      } else if (paywallType === "learn-more") {
        navigate(`/business-model/${selectedPath.id}`);
        scrollToTop();
      } else if (paywallType === "business-model") {
        navigate(`/guide/${selectedPath.id}`);
        scrollToTop();
      }
    }
    
    // Handle other pending actions
    if (pendingAction === "download") {
      executeDownloadAction();
      setPendingAction(null);
    } else if (pendingAction === "share") {
      executeShareAction();
      setPendingAction(null);
    }
  };

  const handlePaymentWithAccount = () => {
    setShowUnlockModal(false);
    setShowPaymentModal(true);
  };

  const handleBusinessCardPayment = async () => {
    // Redirect to proper payment flow instead of using simulation
    // console.log("handleBusinessCardPayment called - redirecting to PaymentAccountModal");
    setShowPaymentModal(true);
    setShowUnlockModal(false);
    return;

    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setHasUnlockedAnalysis(true);
    // Set flag to indicate any payment has been made
    localStorage.setItem("hasAnyPayment", "true");
    setShowPreview(false);
    setShowUnlockModal(false);
    setIsProcessingPayment(false);

    // If this was triggered from "Start Business Model X" button, navigate to guide page
    if (paywallType === "business-model" && selectedPath) {
      navigate(`/guide/${selectedPath!.id}`);
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 0);
    }

    // In a real implementation, this would:
    // 1. Process payment through Stripe
    // 2. Save payment record and unlock status
    // 3. Navigate to guide page if from "Start Business Model X"
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Email functionality
  const handleEmailResults = () => {
    setShowEmailModal(true);
  };

  // Download functionality
  const handleDownloadResults = async () => {
    if (!canViewFullReport) {
      setPendingAction("download");
      setPaywallType("full-report");
      setShowUnlockModal(true);
      return;
    }

    await executeDownloadAction();
  };

  // Share functionality
  const handleShareResults = async () => {
    if (!canViewFullReport) {
      setPendingAction("share");
      setPaywallType("full-report");
      setShowUnlockModal(true);
      return;
    }

    await executeShareAction();
  };

  // Check for required data
  const missingQuizData = !quizData;
  const missingQuizAttemptId = !quizAttemptId;
  const missingScores = !businessModelScores || businessModelScores.length === 0;

  // Add delay before showing Session Expired to allow data loading
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    if ((missingQuizData || missingQuizAttemptId || missingScores) && !isInitializing) {
      console.warn("[Results] Data missing, waiting before showing session expired:", {
        missingQuizData,
        missingQuizAttemptId,
        missingScores,
        quizData,
        quizAttemptId,
        businessModelScores
      });

      // Wait 3 seconds before showing session expired to allow data loading
      const timeout = setTimeout(() => {
        console.error("[Results] Session expired - data still missing after waiting");
        setShowSessionExpired(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [missingQuizData, missingQuizAttemptId, missingScores, isInitializing]);

  // Only show Session Expired after waiting period
  if (showSessionExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-xl mx-auto text-center bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Session Expired</h1>
            <p className="text-lg text-gray-600 mb-6">Your quiz results session has expired or required data is missing. Please retake the quiz to see your personalized results.</p>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Retake the Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showAILoading) {
    return (
      <QuizCompletionLoading
        quizData={quizDataState || quizData}
        userEmail={userEmail}
        onComplete={handleAILoadingComplete}
        onExit={() => setShowAILoading(false)}
      />
    );
  }

  if (showFullReportLoading) {
    return (
      <FullReportLoadingPage
        quizData={quizDataState || quizData}
        userEmail={userEmail}
        onComplete={(data: any) => {
          setLoadedReportData(data);
          setHasLoadedFullReport(true);
          setShowFullReportLoading(false);
          setShowFullReport(true);
        }}
        onExit={() => setShowFullReportLoading(false)}
      />
    );
  }

  if (showFullReport) {
    return (
      <FullReport
        quizData={quizDataState || quizData}
        topPath={personalizedPaths[0]}
        allPaths={personalizedPaths}
        onBack={() => setShowFullReport(false)}
        preloadedData={loadedReportData}
      />
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const iconMap = {
    TrendingUp,
    ShoppingCart: Zap,
    Briefcase: Target,
    GraduationCap: BookOpen,
    Video: Users,
    Store: Shield,
    Package: Zap,
    Monitor: Brain,
  };

  // Split analysis into two paragraphs for blur effect
  const splitAnalysis = (text: string) => {
    const sentences = text.split(". ");
    const midPoint = Math.ceil(sentences.length / 2);
    const firstParagraph =
      sentences.slice(0, midPoint).join(". ") +
      (sentences.length > midPoint ? "." : "");
    const secondParagraph = sentences.slice(midPoint).join(". ");
    return { firstParagraph, secondParagraph };
  };

  // Show loading state if no paths are available yet
  if (!personalizedPaths || personalizedPaths.length === 0) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Generating your personalized business matches...
          </p>
        </div>
      </div>
    );
  }

  // --- BEGIN NEW UI DESIGN ---
  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen p-4 md:p-4 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (insightsData) {
    console.log("[Results] Rendering preview insights:", insightsData);
    // ... render the preview insights UI here ...
  }

  return (
    <>
      <div className="min-h-screen p-4 md:p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto">
          {/* Primary Heading - 30% viewport height */}
          <motion.div
            className="text-center mb-8 md:mb-12 pt-8 md:pt-16 px-2 md:px-0"
            style={{ minHeight: window.innerWidth < 768 ? "25vh" : "30vh" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-2 md:px-0"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              Your Best Fit Business Model is{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {personalizedPaths[0]?.name || "Loading..."}
              </span>
              !
            </motion.h1>

            {/* Email confirmation */}
            {userEmail && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 md:mt-6 inline-flex items-center bg-green-50 border border-green-200 rounded-full px-4 md:px-6 py-2 md:py-3 mx-2"
              >
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium text-sm md:text-base">
                  Results link sent to {userEmail}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Visual Divider */}
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8 md:mb-12 mx-4 md:mx-0"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Secondary Heading */}
          <motion.div
            className="text-center mb-6 md:mb-8 px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Your AI-Powered Business Blueprint
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 md:px-0">
              Personalized recommendations based on your unique goals, skills,
              and preferences
            </p>
          </motion.div>

          {/* AI Analysis Section */}
          {insightsData ? (
            <motion.div
              className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 mb-12 text-white relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Your AI-Generated Insights
                    </h2>
                    <p className="text-blue-100">
                      Personalized analysis based on your unique profile
                    </p>
                  </div>
                </div>

                {/* AI Analysis Content */}
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="text-blue-50 leading-relaxed text-lg">
                      {canViewFullReport ? (
                        // Full content when unlocked
                        <div>
                          {(() => {
                            if (!insightsData || !insightsData.personalizedSummary) {
                              return (
                                <div className="text-blue-50 leading-relaxed text-lg mb-6">
                                  <p className="mb-4">Personalized analysis is not available at this time. Please try again later or contact support if this persists.</p>
                                </div>
                              );
                            }
                            const sentences = insightsData.personalizedSummary.split(". ");
                            const thirdLength = Math.ceil(sentences.length / 3);

                            const firstParagraph =
                              sentences.slice(0, thirdLength).join(". ") +
                              (sentences.length > thirdLength ? "." : "");
                            const secondParagraph =
                              sentences
                                .slice(thirdLength, thirdLength * 2)
                                .join(". ") +
                              (sentences.length > thirdLength * 2 ? "." : "");
                            const thirdParagraph = sentences
                              .slice(thirdLength * 2)
                              .join(". ");

                            return (
                              <div className="text-blue-50 leading-relaxed text-lg mb-6">
                                <p className="mb-4">{firstParagraph}</p>
                                <p className="mb-4">{secondParagraph}</p>
                                <p className="mb-6">{thirdParagraph}</p>
                              </div>
                            );
                          })()}

                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <h4 className="font-bold mb-3 flex items-center">
                                <Target className="h-4 w-4 mr-2" />
                                Key Insights
                              </h4>
                              <ul className="space-y-2">
                                {insightsData.customRecommendations?.map(
                                  (insight: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                                      <span
                                        className="text-sm"
                                        dangerouslySetInnerHTML={renderMarkdownContent(
                                          insight,
                                        )}
                                      />
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-bold mb-3 flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Success Predictors
                              </h4>
                              <ul className="space-y-2">
                                {insightsData.successStrategies?.map(
                                  (predictor: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <Star className="h-4 w-4 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" />
                                      <span
                                        className="text-sm"
                                        dangerouslySetInnerHTML={renderMarkdownContent(
                                          predictor,
                                        )}
                                      />
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Business Info Boxes */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2 emoji">⏱️</div>
                              <div className="text-xs text-blue-200 mb-1 font-bold">Time to Start</div>
                              <div className="text-sm font-normal">
                                {personalizedPaths[0]?.timeToProfit || "3-6 months"}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2 emoji">💰</div>
                              <div className="text-xs text-blue-200 mb-1 font-bold">Initial Investment</div>
                              <div className="text-sm font-normal">
                                {personalizedPaths[0]?.startupCost || "$0-500"}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2">📈</div>
                              <div className="text-xs text-blue-200 mb-1 font-bold">Potential Income</div>
                              <div className="text-sm font-normal">
                                {personalizedPaths[0]?.potentialIncome || "$2K-10K/mo"}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2">🕒</div>
                              <div className="text-xs text-blue-200 mb-1 font-bold">Time Commitment</div>
                              <div className="text-sm font-normal">
                                {quizData.weeklyTimeCommitment ? `${quizData.weeklyTimeCommitment} hours/week` : "10-40 hours/week"}
                              </div>
                            </div>
                          </div>

                          {/* CTAs - Only show when unlocked */}
                          <div className="mt-8 space-y-4">
                            <button
                              onClick={() => {
                                const topPath = personalizedPaths[0];
                                if (topPath) {
                                  if (!canViewFullReport) {
                                    handlePayment(null, "full-report", topPath);
                                    return;
                                  }
                                  handleViewFullReport(topPath);
                                }
                              }}
                              className="w-full bg-white text-purple-600 border-2 border-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 hover:border-purple-700 hover:text-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                            >
                              <FileText className="h-5 w-5 mr-2 inline" />
                              View Full Report
                            </button>

                            <div className="text-center">
                              <button
                                onClick={() => {
                                  const topPath = personalizedPaths[0];
                                  if (topPath) {
                                    if (!canViewFullReport) {
                                      handlePayment(null, "learn-more", topPath);
                                      return;
                                    }
                                    handleLearnMore(topPath);
                                  }
                                }}
                                className="text-white hover:text-gray-300 font-medium text-lg transition-all duration-300 inline-flex items-center group"
                              >
                                <span>
                                  Get started with{" "}
                                  {personalizedPaths[0]?.name}
                                </span>
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Preview with seamless gradient fade effect
                        <div className="relative">
                          {/* Three paragraphs with seamless gradient fade */}
                          <div className="relative mb-8">
                            {(() => {
                              if (!insightsData || !insightsData.personalizedSummary) {
                                return (
                                  <div className="text-blue-50 leading-relaxed text-lg mb-6">
                                    <p className="mb-4">Loading your personalized analysis...</p>
                                  </div>
                                );
                              }
                              
                              const sentences =
                                insightsData.personalizedSummary.split(". ");
                              const thirdLength = Math.ceil(
                                sentences.length / 3,
                              );

                              const firstParagraph =
                                sentences.slice(0, thirdLength).join(". ") +
                                (sentences.length > thirdLength ? "." : "");
                              const secondParagraph =
                                sentences
                                  .slice(thirdLength, thirdLength * 2)
                                  .join(". ") +
                                (sentences.length > thirdLength * 2
                                  ? "."
                                  : "");
                              const thirdParagraph = sentences
                                .slice(thirdLength * 2)
                                .join(". ");

                              return (
                                <div
                                  className="text-blue-50 leading-relaxed text-lg"
                                  style={{
                                    WebkitMask:
                                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                                    mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                                  }}
                                >
                                  {/* First paragraph - fully visible */}
                                  <p className="mb-4">{firstParagraph}</p>

                                  {/* Second paragraph - starts to fade */}
                                  <p className="mb-4">{secondParagraph}</p>

                                  {/* Third paragraph - fades to invisible */}
                                  <p className="mb-6">{thirdParagraph}</p>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Value Proposition Columns - fully visible below faded text */}
                          <div className="mb-12">
                            <div className="grid md:grid-cols-2 gap-8">
                              {/* Column 1 */}
                              <div className="space-y-6">
                                <div className="flex items-start space-x-4 mb-6">
                                  <div className="text-3xl mt-1 emoji">🧠</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Your Business Blueprint
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Discover the exact business model you
                                      should pursue—tailored to your
                                      personality, strengths, and goals.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4 mb-6">
                                  <div className="text-3xl mt-1 emoji">⚠️</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Models to Avoid
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      See which business paths are poor fits
                                      for you and why they're likely to lead
                                      to burnout or failure.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4 mb-6">
                                  <div className="text-3xl mt-1 emoji">🚀</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Step-by-Step Launch Guidance
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Learn how to get started with your
                                      best-fit business model, including
                                      tools, timelines, and tips.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Column 2 */}
                              <div className="space-y-6">
                                <div className="flex items-start space-x-4 mb-6">
                                  <div className="text-3xl mt-1 emoji">💪</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Your Strengths & Blind Spots
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Get a clear breakdown of what you're
                                      naturally great at—and where you'll need
                                      support or growth.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4 mb-6">
                                  <div className="text-3xl mt-1 emoji">📊</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Income Potential & Market Fit
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Understand how much you can realistically earn and how big the opportunity is.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4 mb-6">
                                  <div className="text-3xl mt-1 emoji">🔧</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Skills You Need to Succeed
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Find out which skills you already have,
                                      what to build, and what gaps to close.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Paywall Section - Show for users who haven't unlocked */}
                  {!canViewFullReport && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-12 text-center"
                    >
                      <Lock className="h-8 w-8 text-white mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-white mb-2">
                        Unlock your results with small one-time fee
                      </h4>
                      <p className="text-blue-100 mb-6">
                        Get the full personalized analysis, detailed insights,
                        and success strategies for just{" "}
                        {user ? "$4.99" : "$9.99"}
                      </p>
                      <button
                        onClick={handleUnlockAnalysis}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-full font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-xl mb-8"
                      >
                        Unlock Full Analysis - {user ? "$4.99" : "$9.99"}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
    <motion.div
      className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 mb-12 text-white relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Your AI-Generated Insights
            </h2>
            <p className="text-blue-100">
              Personalized analysis based on your unique profile
            </p>
          </div>
        </div>

                {/* AI Analysis Content */}
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-blue-50 leading-relaxed text-lg">
              {canViewFullReport ? (
                // Full content when unlocked
                <div>
                  {(() => {
                    if (!analysisData || !analysisData.fullAnalysis) {
                      return (
                        <div className="text-blue-50 leading-relaxed text-lg mb-6">
                          <p className="mb-4">Personalized analysis is not available at this time. Please try again later or contact support if this persists.</p>
                        </div>
                      );
                    }
                    const sentences = analysisData.fullAnalysis.split(". ");
                    const thirdLength = Math.ceil(sentences.length / 3);

                    const firstParagraph =
                      sentences.slice(0, thirdLength).join(". ") +
                      (sentences.length > thirdLength ? "." : "");
                    const secondParagraph =
                      sentences
                        .slice(thirdLength, thirdLength * 2)
                        .join(". ") +
                      (sentences.length > thirdLength * 2 ? "." : "");
                    const thirdParagraph = sentences
                      .slice(thirdLength * 2)
                      .join(". ");

                    return (
                      <div className="text-blue-50 leading-relaxed text-lg mb-6">
                        <p className="mb-4">{firstParagraph}</p>
                        <p className="mb-4">{secondParagraph}</p>
                        <p className="mb-6">{thirdParagraph}</p>
                      </div>
                    );
                  })()}

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="font-bold mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Key Insights
                      </h4>
                      <ul className="space-y-2">
                                                        {analysisData?.keyInsights?.map(
                          (insight: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start"
                            >
                              <CheckCircle className="h-4 w-4 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                              <span
                                className="text-sm"
                                dangerouslySetInnerHTML={renderMarkdownContent(
                                  insight,
                                )}
                              />
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold mb-3 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Success Predictors
                      </h4>
                      <ul className="space-y-2">
                                                        {analysisData?.successPredictors?.map(
                          (predictor: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start"
                            >
                              <Star className="h-4 w-4 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" />
                              <span
                                className="text-sm"
                                dangerouslySetInnerHTML={renderMarkdownContent(
                                  predictor,
                                )}
                              />
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Business Info Boxes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2 emoji">⏱️</div>
                      <div className="text-xs text-blue-200 mb-1 font-bold">Time to Start</div>
                      <div className="text-sm font-normal">
                        {personalizedPaths[0]?.timeToProfit || "3-6 months"}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2 emoji">💰</div>
                      <div className="text-xs text-blue-200 mb-1 font-bold">Initial Investment</div>
                      <div className="text-sm font-normal">
                        {personalizedPaths[0]?.startupCost || "$0-500"}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="text-xs text-blue-200 mb-1 font-bold">Potential Income</div>
                      <div className="text-sm font-normal">
                        {personalizedPaths[0]?.potentialIncome || "$2K-10K/mo"}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">🕒</div>
                      <div className="text-xs text-blue-200 mb-1 font-bold">Time Commitment</div>
                      <div className="text-sm font-normal">
                        {quizData.weeklyTimeCommitment ? `${quizData.weeklyTimeCommitment} hours/week` : "10-40 hours/week"}
                      </div>
                    </div>
                  </div>

                  {/* CTAs - Only show when unlocked */}
                  <div className="mt-8 space-y-4">
                    <button
                      onClick={() => {
                        const topPath = personalizedPaths[0];
                        if (topPath) {
                          if (!canViewFullReport) {
                            handlePayment(null, "full-report", topPath);
                            return;
                          }
                          handleViewFullReport(topPath);
                        }
                      }}
                      className="w-full bg-white text-purple-600 border-2 border-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 hover:border-purple-700 hover:text-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                      <FileText className="h-5 w-5 mr-2 inline" />
                      View Full Report
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          const topPath = personalizedPaths[0];
                          if (topPath) {
                            if (!canViewFullReport) {
                              handlePayment(null, "learn-more", topPath);
                              return;
                            }
                            handleLearnMore(topPath);
                          }
                        }}
                        className="text-white hover:text-gray-300 font-medium text-lg transition-all duration-300 inline-flex items-center group"
                      >
                        <span>
                          Get started with{" "}
                          {personalizedPaths[0]?.name}
                        </span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Preview with seamless gradient fade effect
                <div className="relative">
                  {/* Three paragraphs with seamless gradient fade */}
                  <div className="relative mb-8">
                    {(() => {
                      if (!analysisData || !analysisData.fullAnalysis) {
                        return (
                          <div className="text-blue-50 leading-relaxed text-lg mb-6">
                            <p className="mb-4">Loading your personalized analysis...</p>
                          </div>
                        );
                      }
                      
                      const sentences =
                        analysisData.fullAnalysis.split(". ");
                      const thirdLength = Math.ceil(
                        sentences.length / 3,
                      );

                      const firstParagraph =
                        sentences.slice(0, thirdLength).join(". ") +
                        (sentences.length > thirdLength ? "." : "");
                      const secondParagraph =
                        sentences
                          .slice(thirdLength, thirdLength * 2)
                          .join(". ") +
                        (sentences.length > thirdLength * 2
                          ? "."
                          : "");
                      const thirdParagraph = sentences
                        .slice(thirdLength * 2)
                        .join(". ");

                      return (
                        <div
                          className="text-blue-50 leading-relaxed text-lg"
                          style={{
                            WebkitMask:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                            mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                          }}
                        >
                          {/* First paragraph - fully visible */}
                          <p className="mb-4">{firstParagraph}</p>

                          {/* Second paragraph - starts to fade */}
                          <p className="mb-4">{secondParagraph}</p>

                          {/* Third paragraph - fades to invisible */}
                          <p className="mb-6">{thirdParagraph}</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Value Proposition Columns - fully visible below faded text */}
                  <div className="mb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Column 1 */}
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4 mb-6">
                          <div className="text-3xl mt-1 emoji">💰</div>
                          <div>
                            <h4 className="font-bold text-white text-lg mb-2">
                              Your Business Blueprint
                            </h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                              Discover the exact business model you
                              should pursue—tailored to your
                              personality, strengths, and goals.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 mb-6">
                          <div className="text-3xl mt-1 emoji">⚠️</div>
                          <div>
                            <h4 className="font-bold text-white text-lg mb-2">
                              Models to Avoid
                            </h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                              See which business paths are poor fits
                              for you and why they're likely to lead
                              to burnout or failure.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 mb-6">
                          <div className="text-3xl mt-1 emoji">🚀</div>
                          <div>
                            <h4 className="font-bold text-white text-lg mb-2">
                              Step-by-Step Launch Guidance
                            </h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                              Learn how to get started with your
                              best-fit business model, including
                              tools, timelines, and tips.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4 mb-6">
                          <div className="text-3xl mt-1 emoji">💪</div>
                          <div>
                            <h4 className="font-bold text-white text-lg mb-2">
                              Your Strengths & Blind Spots
                            </h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                              Get a clear breakdown of what you're
                              naturally great at—and where you'll need
                              support or growth.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 mb-6">
                          <div className="text-3xl mt-1 emoji">📊</div>
                          <div>
                            <h4 className="font-bold text-white text-lg mb-2">
                              Income Potential & Market Fit
                            </h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                              Understand how much you can realistically earn and how big the opportunity is.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 mb-6">
                          <div className="text-3xl mt-1 emoji">🔧</div>
                          <div>
                            <h4 className="font-bold text-white text-lg mb-2">
                              Skills You Need to Succeed
                            </h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                              Find out which skills you already have,
                              what to build, and what gaps to close.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Paywall Section - Show for users who haven't unlocked */}
          {!canViewFullReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 text-center"
            >
              <Lock className="h-8 w-8 text-white mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">
                Unlock your results with small one-time fee
              </h4>
              <p className="text-blue-100 mb-6">
                Get the full personalized analysis, detailed insights,
                and success strategies for just{" "}
                {user ? "$4.99" : "$9.99"}
              </p>
              <button
                onClick={handleUnlockAnalysis}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-full font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-xl mb-8"
              >
                Unlock Full Analysis - {user ? "$4.99" : "$9.99"}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
)}

          {/* Results - Customized width for better fit */}
          <motion.div
            className="space-y-6 md:space-y-8 mb-8 md:mb-12 px-2 md:px-0"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {personalizedPaths.slice(0, 3).map((path, index) => {
              const safeEmoji = getSafeEmoji(path.id);

              return (
                <motion.div
                  key={path.id}
                  className={`relative bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl border-2 group max-w-4xl mx-auto ${
                    index === 0
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:scale-[1.02]"
                      : "border-gray-200 hover:border-blue-300 hover:scale-[1.02]"
                  }`}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  {/* Locked overlay for cards 2 and 3 when not unlocked */}
                  {index > 0 && !canViewFullReport && (
                    <LockedCardOverlay
                      onUnlock={() => {
                        handlePayment(null, "business-model", path);
                      }}
                    />
                  )}


                  {/* Ranking bubbles */}
                  {index === 0 && (
                    <motion.div
                      className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center">
                        <Star className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        AI RECOMMENDED
                      </div>
                    </motion.div>
                  )}
                  {index === 1 && (
                    <motion.div
                      className="absolute -top-3 md:-top-4 right-1/4 transform translate-x-1/2"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center">
                        <Award className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        2nd Best
                      </div>
                    </motion.div>
                  )}
                  {index === 2 && (
                    <motion.div
                      className="absolute -top-3 md:-top-4 right-1/4 transform translate-x-1/2"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 1.0 }}
                    >
                      <div className="bg-gradient-to-r from-slate-400 to-slate-500 text-white px-3 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center">
                        <Award className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        3rd Best
                      </div>
                    </motion.div>
                  )}

                  {/* Mobile Layout */}
                  <div className="md:hidden h-full p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {/* Emoji and title inline */}
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <span className="text-3xl mr-2 emoji">{safeEmoji}</span>
                          {path.name}
                        </h3>
                        {/* Removed separate emoji span */}
                      </div>
                      {/* Percentage next to title in mobile */}
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${
                            index === 0 ? "text-yellow-600" : "text-blue-600"
                          }`}
                        >
                          {path.fitScore}%
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          AI Match
                        </div>
                      </div>
                    </div>

                    {/* Potential Income */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4" style={{ marginBottom: '0.25rem' }}>
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Potential Income
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-700">
                        {path.potentialIncome}
                      </div>
                    </div>

                    {/* Top Pros - Move directly after Potential Income */}
                    <div className="flex-1 mb-4 mt-2">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        Top Benefits
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {path.pros.slice(0, 3).map((pro, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2 text-xs">
                              •
                            </span>
                            <span className="leading-tight">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      {path.description}
                    </p>

                    {/* Key Metrics in compact grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div
                        className={`${index === 0 ? "bg-white" : "bg-gray-50"} rounded-xl p-2`}
                      >
                        <div className="flex items-center mb-1">
                          <Clock className="h-3 w-3 text-gray-500 mr-1" />
                          <span className="text-xs font-medium text-gray-700">
                            Time to Profit
                          </span>
                        </div>
                        <div className="font-bold text-gray-900 text-xs">
                          {path.timeToProfit}
                        </div>
                      </div>
                      <div
                        className={`${index === 0 ? "bg-white" : "bg-gray-50"} rounded-xl p-2`}
                      >
                        <div className="flex items-center mb-1">
                          <DollarSign className="h-3 w-3 text-gray-500 mr-1" />
                          <span className="text-xs font-medium text-gray-700">
                            Startup Cost
                          </span>
                        </div>
                        <div className="font-bold text-gray-900 text-xs">
                          {path.startupCost}
                        </div>
                      </div>
                    </div>

                    {/* CTAs at bottom for mobile */}
                    <div className="space-y-2 mt-auto">
                      {/* Primary CTA - Only show if card is not locked */}
                      {!(index > 0 && !canViewFullReport) && (
                        <button
                          onClick={() => {
                            if (!canViewFullReport) {
                              handlePayment(null, "full-report", path);
                              return;
                            }
                            handleViewFullReport(path);
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform group-hover:scale-[1.02] flex items-center justify-center text-sm"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          View Full Report
                        </button>
                      )}

                      {/* Secondary CTAs - Two separate lines, left-aligned */}
                      {!(index > 0 && !canViewFullReport) && (
                        <div className="flex flex-col items-start space-y-2 mt-2">
                          <button
                            onClick={() => {
                              if (!canViewFullReport) {
                                handlePayment(null, "learn-more", path);
                                return;
                              }
                              handleLearnMore(path);
                            }}
                            className="text-left font-bold text-sm text-gray-700 hover:text-gray-600 transition-colors duration-300 flex items-center group"
                          >
                            Learn more about {path.name} for you
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                          <button
                            onClick={() => {
                              if (!canViewFullReport) {
                                handlePayment(null, "business-model", path);
                                return;
                              }
                              handleStartBusinessModel(path);
                            }}
                            className="text-left font-bold text-sm text-gray-700 hover:text-gray-600 transition-colors duration-300 flex items-center group"
                          >
                            Complete Guide to {path.name}
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout - New Design */}
                  <div className="hidden md:block h-full p-6 md:p-8">
                    <div className="flex flex-col md:flex-row">
                      {/* Left Side */}
                      <div className="flex-1 md:pr-6 mb-6 md:mb-0">
                        <div className="flex items-center mb-4">
                          {/* Emoji and title inline */}
                          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                            <span className="text-3xl mr-3 emoji">{safeEmoji}</span>
                            {path.name}
                          </h3>
                        </div>

                        <p className="text-gray-600 mb-6 text-sm md:text-base">
                          {path.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className={`${index === 0 ? "bg-white" : "bg-gray-50"} rounded-xl p-3`}>
                            <div className="flex items-center mb-1">
                              <Clock className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-xs font-medium text-gray-700">
                                Time to Profit
                              </span>
                            </div>
                            <div className="font-bold text-sm text-gray-900">
                              {path.timeToProfit}
                            </div>
                          </div>
                          <div className={`${index === 0 ? "bg-white" : "bg-gray-50"} rounded-xl p-3`}>
                            <div className="flex items-center mb-1">
                              <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-xs font-medium text-gray-700">
                                Startup Cost
                              </span>
                            </div>
                            <div className="font-bold text-sm text-gray-900">
                              {path.startupCost}
                            </div>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                          {!(index > 0 && !canViewFullReport) && (
                            <button
                              onClick={() => {
                                if (!canViewFullReport) {
                                  handlePayment(null, "full-report", path);
                                  return;
                                }
                                handleViewFullReport(path);
                              }}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-base flex items-center justify-center hover:scale-[1.02] transition-all duration-300"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Full Report
                            </button>
                          )}
                          {!(index > 0 && !canViewFullReport) && (
                            <div className="text-center space-y-2">
                              <button
                                onClick={() => {
                                  if (!canViewFullReport) {
                                    handlePayment(null, "learn-more", path);
                                    return;
                                  }
                                  handleLearnMore(path);
                                }}
                                className="text-gray-700 hover:text-blue-600 text-sm font-bold flex items-center justify-center group"
                              >
                                Learn more about {path.name} for you
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                              </button>
                              <button
                                onClick={() => {
                                  if (!canViewFullReport) {
                                    handlePayment(null, "business-model", path);
                                    return;
                                  }
                                  handleStartBusinessModel(path);
                                }}
                                className="text-gray-700 hover:text-blue-600 text-sm font-bold flex items-center justify-center group"
                              >
                                Complete Guide to {path.name}
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="md:w-48 flex flex-col">
                        <div className="text-center mb-6">
                          <div className="text-5xl font-bold text-yellow-600">
                            {path.fitScore}%
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            AI Match
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-3">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">
                              Potential Income
                            </span>
                          </div>
                          <div className="text-xl font-bold text-green-700">
                            {path.potentialIncome}
                          </div>
                        </div>

                        {/* Top Benefits - Move directly after Potential Income */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                            Top Benefits
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-2">
                            {path.pros.slice(0, 3).map((pro, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span className="leading-tight">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Action Buttons Section */}
          <motion.div
            className="mt-8 md:mt-12 text-center px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Take Action on Your Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              <button
                onClick={handleDownloadResults}
                className={`p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group ${
                  canViewFullReport ? "bg-white" : "bg-gray-100 relative"
                }`}
              >
                {!canViewFullReport && (
                  <Lock className="h-3 w-3 md:h-4 md:w-4 text-gray-500 absolute top-2 md:top-3 right-2 md:right-3" />
                )}
                <Download
                  className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform ${
                    canViewFullReport ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <h4
                  className={`font-bold mb-1 md:mb-2 text-sm md:text-base ${
                    canViewFullReport ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  Download as PDF
                </h4>
                <p
                  className={`text-xs md:text-sm ${
                    canViewFullReport ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {canViewFullReport
                    ? "Get your complete report as a downloadable file for offline reference"
                    : "Unlock full analysis to download your results"}
                </p>
              </button>

              <button
                onClick={handleEmailResults}
                className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Mail className="h-6 w-6 md:h-8 md:w-8 text-green-600 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">
                  Email My Results
                </h4>
                <p className="text-gray-600 text-xs md:text-sm">
                  Send this report to your email for easy access and sharing
                </p>
              </button>

              <button
                onClick={handleShareResults}
                className={`p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group ${
                  canViewFullReport ? "bg-white" : "bg-gray-100 relative"
                }`}
              >
                {!canViewFullReport && (
                  <Lock className="h-3 w-3 md:h-4 md:w-4 text-gray-500 absolute top-2 md:top-3 right-2 md:right-3" />
                )}
                <Share2
                  className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform ${
                    canViewFullReport ? "text-purple-600" : "text-gray-400"
                  }`}
                />
                <h4
                  className={`font-bold mb-1 md:mb-2 text-sm md:text-base ${
                    canViewFullReport ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  Share My Results
                </h4>
                <p
                  className={`text-xs md:text-sm ${
                    canViewFullReport ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {canViewFullReport
                    ? "Share your business match with friends, family, and mentors"
                    : "Unlock full analysis to share your results"}
                </p>
              </button>
            </div>
          </motion.div>

          {/* Unlock Premium Section - Show for users who haven't unlocked */}
          {!canViewFullReport && (
            <motion.div
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-6 md:p-8 lg:p-12 text-center relative overflow-hidden mt-8 md:mt-12 mx-2 md:mx-0"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative max-w-4xl mx-auto">
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Lock className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
                </motion.div>

                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-2 md:px-0"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  Unlock Your Complete AI-Powered Roadmap
                </motion.h2>

                <motion.p
                  className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 lg:mb-10 leading-relaxed px-4 md:px-0"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  Get detailed step-by-step action plans, curated resources, and
                  advanced AI insights to accelerate your success
                </motion.p>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-10"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    {
                      icon: Brain,
                      title: "Advanced AI Analysis",
                      description:
                        "Deep personality profiling and custom success predictions based on your unique profile",
                    },
                    {
                      icon: Target,
                      title: "Detailed Action Plans",
                      description:
                        "Week-by-week roadmaps with specific milestones and success metrics",
                    },
                    {
                      icon: BookOpen,
                      title: "Curated Resources",
                      description:
                        "Hand-picked tools, courses, and platforms with ratings and reviews",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center"
                      variants={fadeInUp}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-white mb-2 md:mb-3 text-sm md:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="mb-6 md:mb-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="text-gray-400 line-through text-lg md:text-xl mb-2">
                    $49.99 Value
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                    {user ? "$4.99" : "$9.99"}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base lg:text-lg px-2 md:px-0">
                    One-time payment • Instant access • 30-day guarantee
                  </div>
                </motion.div>

                <motion.button
                  onClick={handleUnlockAnalysis}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 md:px-8 lg:px-12 py-3 md:py-4 lg:py-5 rounded-full text-base md:text-lg lg:text-xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Unlock AI-Powered Roadmap Now
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Dashboard Link Section - Show when user has paid */}
          {canViewFullReport && (
            <motion.div
              className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 md:p-8 lg:p-12 text-center relative overflow-hidden mt-8 md:mt-12 mx-2 md:mx-0"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative max-w-4xl mx-auto">
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <CheckCircle className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
                </motion.div>

                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-2 md:px-0"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  Your Analysis is Complete!
                </motion.h2>

                <motion.p
                  className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 lg:mb-10 leading-relaxed px-4 md:px-0"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  Access your personalized dashboard to track your progress,
                  view detailed insights, and manage your business journey.
                </motion.p>

                <motion.button
                  onClick={() => {
                    navigate("/dashboard");
                    // Scroll to top after navigation
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 px-6 md:px-8 lg:px-12 py-3 md:py-4 lg:py-5 rounded-full text-base md:text-lg lg:text-xl font-bold hover:from-green-300 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to Dashboard
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Paywall Modal - Keep for logged in users */}
        <PaywallModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          onUnlock={handlePaymentWithAccount}
          type={paywallType}
          title={selectedPath?.name}
        />

        {/* Payment Account Modal - For new users */}
        <PaymentAccountModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          type={paywallType}
          title={selectedPath?.name}
        />
      </div>

      <EmailResultsModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        quizData={quizDataState || quizData}
        quizAttemptId={quizAttemptId}
        userEmail={user?.email || userEmail || ''}
      />
    </>
  );
  // --- END NEW UI DESIGN ---
}

export default Results;
