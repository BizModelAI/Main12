import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PaywallProvider } from "./contexts/PaywallContext";
import {
  BusinessModelScoresProvider,
  cleanupExpiredBusinessModelScores,
  useBusinessModelScores,
} from "./contexts/BusinessModelScoresContext";
import { AIInsightsProvider } from './contexts/AIInsightsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Import debug utilities (available as window.debugOpenAI and window.debugAIContent)
import "./utils/debugOpenAI";
import "./utils/debugAIContent";
import "./utils/clearAllCaches";
import "./utils/debugBusinessModels";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import BusinessExplorer from "./pages/BusinessExplorer";

import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import CongratulationsGuest from "./components/CongratulationsGuest";
import BusinessModelDetail from "./components/BusinessModelDetail";
import { AICacheManager } from "./utils/aiCacheManager";
import { businessModelService } from "./utils/businessModelService";
import { AIService } from "./utils/aiService";
import BusinessGuide from "./components/BusinessGuide";
import DownloadReportPage from "./pages/DownloadReportPage";
import PDFReportPage from "./pages/PDFReportPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UnsubscribePage from "./pages/UnsubscribePage";
import AdminPage from "./pages/Admin";
import QuizCompletionLoading from "./components/QuizCompletionLoading";
import SaveResultsPayment from "./pages/SaveResultsPayment";
import { NavigationGuardWrapper } from "./components/NavigationGuardWrapper";
import { initializeEmojiSafeguards } from "./utils/contentUtils";
import CongratulationsLoggedIn from "./components/CongratulationsLoggedIn";
import DataExpiredMessage from "./components/DataExpiredMessage";
import { cleanupExpiredAIContent } from "./utils/cleanupUtils";

// Initialize emoji corruption prevention system
initializeEmojiSafeguards();

// Alias for loading page component
const LoadingPage = QuizCompletionLoading;
import { QuizData } from "./types";

function MainAppContent() {
  const { user, isRealUser } = useAuth();
  const [quizData, setQuizData] = React.useState<QuizData | null>(null);
  const [showEmailCapture, setShowEmailCapture] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [showAILoading, setShowAILoading] = React.useState(false);
  const [loadedReportData, setLoadedReportData] = React.useState<any>(null);
  const [showCongratulations, setShowCongratulations] = React.useState(false);
  const [dataExpired, setDataExpired] = React.useState(false);

  // Set user email from auth context if available
  React.useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
      localStorage.setItem("userEmail", user.email);
    }
  }, [user?.email]);

  // Restore data from localStorage on app start, but NOT on /quiz (handled in Quiz.tsx)
  React.useEffect(() => {
    if (window.location.pathname === "/quiz") {
      // All cache clearing and quiz data reset is handled in Quiz.tsx
      return;
    }
    const savedQuizData = localStorage.getItem("quizData");
    const savedUserEmail = localStorage.getItem("userEmail");
    const savedLoadedReportData = localStorage.getItem("loadedReportData");

    if (savedQuizData) {
      try {
        const parsed = JSON.parse(savedQuizData);
        console.log("Loading quiz data from localStorage on app startup:", parsed);
        setQuizData(parsed);
      } catch (error) {
        console.error("Error parsing saved quiz data:", error);
      }
    } else {
      console.log("No saved quiz data found in localStorage");
    }

    if (savedUserEmail) {
      setUserEmail(savedUserEmail);
    }

    if (savedLoadedReportData) {
      try {
        const parsed = JSON.parse(savedLoadedReportData);
        setLoadedReportData(parsed);
      } catch (error) {
        console.error("Error parsing saved loaded report data:", error);
      }
    }
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const hasLoggedQuizSkip = React.useRef(false);

  // Handle email links with attempt ID and email parameters
  React.useEffect(() => {
    // Only run if location is properly initialized
    if (!location || !location.pathname || !location.search) {
      return;
    }

    if (location.pathname === "/results" && location.search) {
      try {
        const searchParams = new URLSearchParams(location.search);
        const email = searchParams.get("email");
        const attempt = searchParams.get("attempt");
        
        if (email && attempt) {
          
          const loadEmailLinkData = async () => {
            try {
              const response = await fetch(`/api/email-link/${attempt}/${encodeURIComponent(email)}`);
              
              if (response.ok) {
                const data = await response.json();
                
                if (data.status === "expired") {
                  // Show expired data message
                  setDataExpired(true);
                  return;
                }
                
                if (data.status === "paid" || data.status === "unpaid") {
                  // Load the quiz data and set up the results page
                  setQuizData(data.quizData);
                  setUserEmail(data.email);
                  
                  if (data.attemptId) {
                    localStorage.setItem("currentQuizAttemptId", data.attemptId.toString());
                  }
                  
                  // If paid user, they have full access
                  if (data.status === "paid") {
                    localStorage.setItem("hasUnlockedAnalysis", "true");
                    localStorage.setItem("hasCompletedQuiz", "true");
                  }
                }
              } else {
                console.error("Failed to load email link data");
              }
            } catch (error) {
              console.error("Error loading email link data:", error);
            }
          };
          
          loadEmailLinkData();
        }
      } catch (error) {
        console.error("Error parsing email link parameters:", error);
      }
    }
  }, [location?.pathname, location?.search]);

  // Ensure quiz data persists even if React state gets reset
  React.useEffect(() => {
    if (!quizData) {
      // Check if localStorage has quiz data but React state doesn't
      const savedQuizData = localStorage.getItem("quizData");
      if (savedQuizData) {
        try {
          const parsed = JSON.parse(savedQuizData);
          setQuizData(parsed);
        } catch (error) {
          console.error("Error restoring quiz data from localStorage:", error);
        }
      }
    }
  }, [quizData]);

  // Clean up expired localStorage data for anonymous users
  React.useEffect(() => {
    const cleanupExpiredData = () => {
      // Clean up expired quiz data
      const expiresAt = localStorage.getItem("quizDataExpires");
      if (expiresAt) {
        const expireTime = parseInt(expiresAt);
        const now = Date.now();

        // Add buffer time to prevent clearing data during navigation
        const bufferTime = 2 * 60 * 1000; // 2 minutes buffer
        if (now > (expireTime + bufferTime)) {
          console.log('Cleaning up expired quiz data');
          localStorage.removeItem("quizData");
          localStorage.removeItem("quizDataTimestamp");
          localStorage.removeItem("quizDataExpires");

          // Also clear React state if it matches the expired data
          const savedQuizData = localStorage.getItem("quizData");
          if (!savedQuizData && quizData) {
            setQuizData(null);
          }
        }
      }

      // Clean up expired AI content for anonymous users
      try {
        cleanupExpiredAIContent();
      } catch (error) {
        console.error("Error cleaning up AI content:", error);
      }

      // Clean up expired business model scores
      try {
        cleanupExpiredBusinessModelScores();
      } catch (error) {
        console.error("Error cleaning up business model scores:", error);
      }
    };

    // Delay initial cleanup to prevent race conditions during navigation
    const initialCleanupTimeout = setTimeout(cleanupExpiredData, 5000); // 5 second delay

    // Run cleanup every 5 minutes to catch expiration during session
    const interval = setInterval(cleanupExpiredData, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialCleanupTimeout);
    };
  }, [quizData]);

  // Handler for AI loading completion
  const handleAILoadingComplete = (data: any) => {
    setLoadedReportData(data);
    setShowAILoading(false);

    // Only show congratulations if it hasn't been shown yet
    setShowCongratulations(true);
  };

  // TEMPORARY: Mock quiz data for testing with COMPLETE data structure
  const generateMockQuizData = (): QuizData => {
    return {
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
      pathPreference: "mix",
      controlImportance: 4,

      // Round 6: Business Model Fit Filters
      onlinePresenceComfort: "yes",
      clientCallsComfort: "yes",
      physicalShippingOpenness: "no",
      workStylePreference: "mix-both",
      socialMediaInterest: 3,
      ecosystemParticipation: "yes",
      existingAudience: "no",
      promotingOthersOpenness: "yes",
      teachVsSolvePreference: "both",
      meaningfulContributionImportance: 4,
    };
  };

  // Load quiz data from localStorage first, then server if authenticated
  React.useEffect(() => {
    const loadQuizData = async () => {
      // Don't auto-load quiz data when user is on /quiz page (they want to start fresh)
      if (location?.pathname === "/quiz") {
        if (!hasLoggedQuizSkip.current) {
          hasLoggedQuizSkip.current = true;
        }
        return;
      }

      if (!quizData) {
        // First try localStorage (works for both authenticated and non-authenticated users)
        const savedQuizData = localStorage.getItem("quizData");
        if (savedQuizData) {
          try {
            const parsed = JSON.parse(savedQuizData);
            setQuizData(parsed);
            return; // Found data in localStorage, no need to fetch from server
          } catch (error) {
            console.error(
              "MainAppContent - Error parsing localStorage quiz data:",
              error,
            );
          }
        }

        // If no localStorage data and user is authenticated, try server
        if (user && isRealUser) {
          try {
            const response = await fetch("/api/auth/latest-quiz-data", {
              credentials: "include",
            });
            if (response.ok) {
              const data = await response.json();
              if (data.quizData) {
                setQuizData(data.quizData);
                localStorage.setItem("quizData", JSON.stringify(data.quizData));
              }
            } else {
              console.log(
                "MainAppContent - Server request failed, no quiz data available",
              );
            }
          } catch (error) {
            console.log(
              "MainAppContent - Error loading from server (non-critical):",
              error,
            );
          }
        } else {
          console.log(
            "MainAppContent - User not authenticated, relying on localStorage only",
          );
        }
      }
    };

    loadQuizData();
  }, [quizData, user, isRealUser, location?.pathname]);

  React.useEffect(() => {
    // Clear AI insights when navigating to home page
    if (location?.pathname === "/") {
      localStorage.removeItem("quiz-completion-ai-insights");
    }
  }, [location?.pathname]);

  if (location?.pathname === "/quiz") {
    return (
      <QuizWithNavigation
        quizData={quizData}
        setQuizData={setQuizData}
        showEmailCapture={showEmailCapture}
        setShowEmailCapture={setShowEmailCapture}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        generateMockQuizData={generateMockQuizData}
        showAILoading={showAILoading}
        setShowAILoading={setShowAILoading}
        loadedReportData={loadedReportData}
        setLoadedReportData={setLoadedReportData}
        showCongratulations={showCongratulations}
        setShowCongratulations={setShowCongratulations}
        handleAILoadingComplete={handleAILoadingComplete}
      />
    );
  }

  if (location?.pathname === "/results") {
    if (dataExpired) {
      return <DataExpiredMessage />;
    }
    
    return (
      <Layout>
        <ResultsWrapperWithReset
          quizData={quizData}
          userEmail={userEmail}
          onBack={() => window.history.back()}
          loadedReportData={loadedReportData}
          setShowCongratulations={setShowCongratulations}
        />
      </Layout>
    );
  }

  if (
    location?.pathname === "/quiz-loading"
  ) {
    return (
      <QuizCompletionLoadingWrapper
        quizData={quizData}
        userEmail={userEmail}
        showCongratulations={showCongratulations}
        setUserEmail={setUserEmail}
        setShowCongratulations={setShowCongratulations}
        loadedReportData={loadedReportData}
        handleAILoadingComplete={handleAILoadingComplete}
      />
    );
  }

  // Default fallback
  return <div>Loading...</div>;
}



// Comprehensive cache clearing function for new quiz sessions
const clearQuizRelatedCache = () => {
  console.log("Clearing all quiz-related cache for new session");

  // Quiz data
  localStorage.removeItem("quizData");
  localStorage.removeItem("hasCompletedQuiz");
  localStorage.removeItem("currentQuizAttemptId");
  localStorage.removeItem("pendingQuizData");
  localStorage.removeItem("requiresQuizPayment");

  // AI-related data
  localStorage.removeItem("quiz-completion-ai-insights");
  localStorage.removeItem("loadedReportData");
  localStorage.removeItem("ai-generation-in-progress");
  localStorage.removeItem("ai-generation-timestamp");

  // UI state flags
  localStorage.removeItem("congratulationsShown");
  localStorage.removeItem("hasEverSelectedModel");
  localStorage.removeItem("selectedBusinessModel");

  // Clear AI service caches
  const aiCacheManager = AICacheManager.getInstance();
  aiCacheManager.forceResetCache();

  // Clear any legacy AI cache keys
  // Note: AI content is now stored in database per user/quiz attempt
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith("ai_insights_") || // Legacy AI service cache keys
        key.startsWith("preview_") || // Legacy preview cache keys
        key.startsWith("fullreport_") || // Legacy full report cache keys
        key.startsWith("ai-analysis-") ||
        key.startsWith("skills-analysis-") ||
        key.startsWith("ai-cache-") ||
        key.startsWith("confetti_shown_"))
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  console.log(
    `Cleared AI caches and ${keysToRemove.length + 12} legacy cache entries for new quiz session (AI content now in database)`,
  );
};

// Quiz completion loading wrapper component for the /loading route
const QuizCompletionLoadingWrapper: React.FC<{
  quizData: QuizData | null;
  userEmail: string | null;
  showCongratulations: boolean;
  setUserEmail: (email: string) => void;
  setShowCongratulations: (show: boolean) => void;
  loadedReportData: any;
  handleAILoadingComplete: (data: any) => void;
}> = ({
  quizData,
  userEmail,
  showCongratulations,
  setUserEmail,
  setShowCongratulations,
  loadedReportData,
  handleAILoadingComplete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoadingComplete = () => {
    console.log(
      "Quiz completion loading complete, checking congratulations tracking",
    );

    // Store quiz data immediately when loading completes
    if (quizData) {
      console.log("Storing quiz data to localStorage after loading completion");
      localStorage.setItem("quizData", JSON.stringify(quizData));
    }

    // Check if congratulations was already shown
    const congratulationsShown = localStorage.getItem("congratulationsShown");
    if (!congratulationsShown || congratulationsShown === "false") {
      console.log("Showing congratulations for the first time");
      setShowCongratulations(true);
      localStorage.setItem("congratulationsShown", "true");
    } else {
      console.log("Congratulations already shown, navigating directly to results");
      // Store quiz data before navigating
      if (quizData) {
        console.log("Storing quiz data before direct navigation to results");
        localStorage.setItem("quizData", JSON.stringify(quizData));
      }
      // If congratulations was already shown, go directly to results
      setTimeout(() => {
        navigate("/results");
      }, 100);
    }
  };

  // Handler for congratulations completion with proper navigation
  const handleCongratulationsComplete = (email?: string) => {
    console.log("Congratulations complete, navigating to results");
    if (email) {
      setUserEmail(email);
      localStorage.setItem("userEmail", email);
    }
    setShowCongratulations(false);

    // Store data in localStorage before navigation
    if (quizData) {
      localStorage.setItem("quizData", JSON.stringify(quizData));
    }
    if (loadedReportData) {
      localStorage.setItem(
        "loadedReportData",
        JSON.stringify(loadedReportData),
      );
    }

    // Use React Router navigation instead of window.location.href
    navigate("/results");
  };

  return (
    <div className="relative">
      {quizData && (
        <QuizCompletionLoading
          quizData={quizData}
          onComplete={handleLoadingComplete}
        />
      )}
      {showCongratulations && quizData && user && (
        <CongratulationsLoggedIn
          onContinue={handleCongratulationsComplete}
          onSendEmailPreview={() => {}}
          quizData={quizData}
          onStartAIGeneration={handleCongratulationsComplete}
        />
      )}
      {showCongratulations && quizData && !user && (
        <CongratulationsGuest
          onEmailSubmit={handleCongratulationsComplete}
          onContinueAsGuest={handleCongratulationsComplete}
          onReturnToQuiz={() => navigate("/quiz")}
          quizData={quizData}
          onStartAIGeneration={handleCongratulationsComplete}
        />
      )}
    </div>
  );
};

// Component that handles quiz navigation
const QuizWithNavigation: React.FC<{
  quizData: QuizData | null;
  setQuizData: (data: QuizData | null) => void;
  showEmailCapture: boolean;
  setShowEmailCapture: (show: boolean) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  generateMockQuizData: () => QuizData;
  showAILoading: boolean;
  setShowAILoading: (show: boolean) => void;
  loadedReportData: any;
  setLoadedReportData: (data: any) => void;
  showCongratulations: boolean;
  setShowCongratulations: (show: boolean) => void;
  handleAILoadingComplete: (data: any) => void;
}> = ({
  quizData,
  setQuizData,
  showEmailCapture,
  setShowEmailCapture,
  userEmail,
  setUserEmail,
  generateMockQuizData,
  showAILoading,
  setShowAILoading,
  loadedReportData,
  setLoadedReportData,
  showCongratulations,
  setShowCongratulations,
  handleAILoadingComplete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { calculateAndStoreScores } = useBusinessModelScores();

  const handleQuizComplete = async (data: QuizData) => {
    setQuizData(data);

    // Get stored email if user provided one during the session
    const storedEmail = localStorage.getItem("userEmail");

    try {
      // TIER 1 & 2: For authenticated users (both paid and temporary), save to database
      if (user) {
        // Use the legacy endpoint for authenticated users to maintain compatibility
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/auth/save-quiz-data", true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/json");

        const response = await new Promise<{
          ok: boolean;
          status: number;
          statusText: string;
          text: string;
        }>((resolve, reject) => {
          xhr.onload = () => {
            resolve({
              ok: xhr.status >= 200 && xhr.status < 300,
              status: xhr.status,
              statusText: xhr.statusText,
              text: xhr.responseText,
            });
          };
          xhr.onerror = () => reject(new Error("XMLHttpRequest network error"));
          xhr.ontimeout = () => reject(new Error("XMLHttpRequest timeout"));
          xhr.timeout = 10000; // 10 second timeout
          xhr.send(JSON.stringify({ quizData: data }));
        });

        if (response.ok) {
          const responseData = JSON.parse(response.text);
          if (responseData.quizAttemptId) {
            localStorage.setItem(
              "currentQuizAttemptId",
              responseData.quizAttemptId.toString(),
            );
            

          }
        } else {
          console.error(
            "Failed to save quiz data:",
            response.status,
            response.statusText,
          );
        }
      }
      // TIER 2: User has provided email but not authenticated - will be handled by EmailCapture component
      else if (storedEmail) {
        // EmailCapture component will create temporary account when email is provided
        // No action needed here - quiz data is stored in component state and localStorage as backup
        localStorage.setItem("quizData", JSON.stringify(data));
        localStorage.setItem("quizDataTimestamp", Date.now().toString());
      }
      // TIER 3: Anonymous users - localStorage with 1-hour expiration
      else {
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

        localStorage.setItem("quizData", JSON.stringify(data));
        localStorage.setItem("quizDataTimestamp", Date.now().toString());
        localStorage.setItem("quizDataExpires", expiresAt.toString());
      }
    } catch (error) {
      console.error("Error in quiz completion caching:", error);
      // Fallback: Always store in localStorage as backup
      localStorage.setItem("quizData", JSON.stringify(data));
      localStorage.setItem("quizDataTimestamp", Date.now().toString());
    }

    // CRITICAL: Calculate and store business model scores immediately after quiz completion
    try {
      const quizAttemptId = localStorage.getItem("currentQuizAttemptId");
      const attemptId = quizAttemptId ? parseInt(quizAttemptId) : undefined;

      await calculateAndStoreScores(data, attemptId);
    } catch (scoresError) {
      console.error("❌ Error calculating business model scores:", scoresError);
      // Don't block the flow - scores can be calculated later if needed
    }

    // Reset congratulations tracking for this new quiz completion
    setShowCongratulations(false);
    localStorage.setItem("congratulationsShown", "false");
    // Navigate to new loading page instead of showing congratulations immediately
    navigate("/quiz-loading");
  };

  const handleCongratulationsComplete = (email?: string) => {
    console.log("Current quizData state:", quizData);
    console.log("Current loadedReportData state:", loadedReportData);

    if (email) {
      setUserEmail(email);
      localStorage.setItem("userEmail", email);
    }

    // IMPORTANT: Reset congratulations state BEFORE navigation
    setShowCongratulations(false);

    // Store quiz data and loaded report data before navigation
    if (quizData) {
      localStorage.setItem("quizData", JSON.stringify(quizData));
    } else {
      console.error(
        "No quizData to store - this may cause the results page to fail",
      );
    }

    if (loadedReportData) {
      localStorage.setItem(
        "loadedReportData",
        JSON.stringify(loadedReportData),
      );
    }

    setTimeout(() => {
      navigate("/results");
    }, 100);
  };

  const handleReturnToQuiz = () => {
    console.log("Returning to quiz - clearing all quiz-related cache");

    // Clear all quiz-related state
    setShowCongratulations(false);
    setQuizData(null);
    setUserEmail(null);
    setShowAILoading(false);
    setShowEmailCapture(false);
    setLoadedReportData(null);

    // Clear all localStorage cache
    clearQuizRelatedCache();

    // Stay on current page (quiz)
  };

  const handleSkipToResults = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(
      "Skip button clicked! Generating mock data and navigating directly to results...",
    );
    const mockData = generateMockQuizData();

    // Set the data and navigate directly, bypassing all loading states
    setQuizData(mockData);
    setUserEmail("delivered@resend.dev");
    setShowAILoading(false);
    setShowCongratulations(false);
    setShowEmailCapture(false);
    // Reset congratulations tracking
    setShowCongratulations(false);
    localStorage.setItem("congratulationsShown", "false");

    console.log("Navigating to /results");
    // Navigate immediately for dev purposes
    navigate("/results");
  };

  return (
    <div className="relative">
      {/* TEMPORARY SKIP BUTTON - REMOVE LATER */}
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          type="button"
          onClick={handleSkipToResults}
          className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 border-2 border-white"
          style={{ zIndex: 9999 }}
          hidden
        >
           SKIP TO RESULTS (DEV)
        </button>
      </div>

      <Quiz
        onComplete={handleQuizComplete}
        onBack={() => window.history.back()}
        userId={
          user && !String(user.id).startsWith("temp_")
            ? parseInt(String(user.id))
            : undefined
        }
      />
      {showCongratulations && quizData && user && (
        <CongratulationsLoggedIn
          onContinue={handleCongratulationsComplete}
          onSendEmailPreview={() => {}}
          quizData={quizData}
          onStartAIGeneration={handleCongratulationsComplete}
        />
      )}
      {showCongratulations && quizData && !user && (
        <CongratulationsGuest
          onEmailSubmit={handleCongratulationsComplete}
          onContinueAsGuest={handleCongratulationsComplete}
          onReturnToQuiz={handleReturnToQuiz}
          quizData={quizData}
          onStartAIGeneration={handleCongratulationsComplete}
        />
      )}
    </div>
  );
};

// Wrapper component to handle results display with congratulations reset
const ResultsWrapperWithReset: React.FC<{
  quizData: QuizData | null;
  userEmail: string | null;
  onBack: () => void;
  loadedReportData?: any;
  setShowCongratulations: (show: boolean) => void;
}> = ({
  quizData,
  userEmail,
  onBack,
  loadedReportData,
  setShowCongratulations,
}) => {
  console.log("ResultsWrapper received quizData:", quizData);
  console.log("ResultsWrapper received userEmail:", userEmail);
  console.log("ResultsWrapper received loadedReportData:", loadedReportData);

  // Add state to track if we're fetching fallback data
  const [isFetchingFallback, setIsFetchingFallback] = React.useState(false);
  const [fallbackQuizData, setFallbackQuizData] = React.useState<QuizData | null>(null);

  // Effect to fetch fallback data if none is available
  React.useEffect(() => {
    if (!quizData && !fallbackQuizData && !isFetchingFallback) {
      console.log("No quiz data available, checking localStorage first");
      setIsFetchingFallback(true);

      // First priority: Check localStorage
      const savedQuizData = localStorage.getItem("quizData");
      if (savedQuizData) {
        try {
          const parsed = JSON.parse(savedQuizData);
          console.log("Found existing quiz data in localStorage, using immediately");
          setFallbackQuizData(parsed);
          setIsFetchingFallback(false);
          return;
        } catch (error) {
          console.error("Failed to parse localStorage quiz data:", error);
        }
      }

      // Only try API if localStorage doesn't have data
      const attemptId = localStorage.getItem("currentQuizAttemptId");
      if (attemptId) {
        console.log("No localStorage data, attempting API fetch with ID:", attemptId);

        // Simplified API approach with timeout
        const trySimpleAPIFetch = async () => {
          try {
            // Set a timeout for the entire operation
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            console.log("Trying simple API fetch with timeout...");
            const res = await fetch(`/api/quiz-attempts/by-id/${attemptId}`, {
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
              throw new Error(`API responded with status: ${res.status}`);
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('API returned non-JSON content');
            }

            const data = await res.json();
            if (data && data.success && data.quizData) {
              console.log('Successfully retrieved quiz data from API');
              return data.quizData;
            } else {
              throw new Error('API returned invalid data structure');
            }
          } catch (error) {
            if (error.name === 'AbortError') {
              console.log("API request timed out");
            } else {
              console.log("API request failed:", error.message);
            }
            return null;
          }
        };

        trySimpleAPIFetch()
          .then((quizData) => {
            if (quizData) {
              setFallbackQuizData(quizData);
              localStorage.setItem("quizData", JSON.stringify(quizData));
              console.log("API fetch successful, data cached");
            } else {
              console.log("API fetch failed, proceeding without remote data");
            }
          })
          .finally(() => {
            setIsFetchingFallback(false);
          });
      } else {
        console.log("No attempt ID available, proceeding without remote data");
        setIsFetchingFallback(false);
      }
    }
  }, [quizData, fallbackQuizData, isFetchingFallback]);

  // Check localStorage if no quiz data is provided via props
  const savedQuizData = React.useMemo(() => {
    console.log("ResultsWrapper - checking quiz data...");
    console.log("Props quizData:", quizData);

    if (quizData) {
      console.log("Using quizData from props");
      return quizData;
    }

    // Check if we have fallback data from API
    if (fallbackQuizData) {
      console.log("Using fallback quiz data from API");
      return fallbackQuizData;
    }

    console.log("No quizData in props, checking localStorage");
    const saved = localStorage.getItem("quizData");
    console.log("localStorage quizData:", saved);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("Successfully parsed quizData from localStorage:", parsed);
        return parsed;
      } catch (error) {
        console.error("Error parsing quizData from localStorage:", error);
        return null;
      }
    }
    console.log("No quizData found in localStorage");
    return null;
  }, [quizData, fallbackQuizData]);

  // Also check localStorage for loadedReportData
  const savedLoadedReportData = React.useMemo(() => {
    if (loadedReportData) return loadedReportData;

    const saved = localStorage.getItem("loadedReportData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("Retrieved loadedReportData from localStorage:", parsed);
        return parsed;
      } catch (error) {
        console.error(
          "Error parsing loadedReportData from localStorage:",
          error,
        );
        return null;
      }
    }
    return null;
  }, [loadedReportData]);

  // Clear congratulations state when component mounts (user navigated to results)
  // This effect is now handled by the QuizCompletionLoadingWrapper
  // React.useEffect(() => {
  //   setShowCongratulations(false);
  // }, [setShowCongratulations]);

  // Show loading while fetching fallback data
  if (isFetchingFallback && !savedQuizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your quiz results...</p>
        </div>
      </div>
    );
  }

  if (savedQuizData) {
    console.log("Rendering Results component with savedQuizData");
    return (
      <Results
        quizData={savedQuizData}
        onBack={onBack}
        userEmail={userEmail}
        preloadedReportData={savedLoadedReportData}
      />
    );
  } else {
    console.error("No quiz data available - showing fallback message");
    console.log("Current localStorage keys:", Object.keys(localStorage));
    console.log("localStorage quizData:", localStorage.getItem("quizData"));
    console.log(
      "localStorage currentQuizAttemptId:",
      localStorage.getItem("currentQuizAttemptId"),
    );

    // Try to get quiz data from the API as a last resort
    React.useEffect(() => {
      const fetchQuizData = async () => {
        if (isFetchingFallback) return; // Prevent multiple simultaneous requests
        
        try {
          setIsFetchingFallback(true);
          console.log("Attempting to fetch quiz data from API as fallback...");
          const response = await fetch("/api/auth/latest-quiz-data", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Fallback API response:", data);
            if (data.quizData) {
              console.log("Found quiz data via API, storing in localStorage and state");
              localStorage.setItem("quizData", JSON.stringify(data.quizData));
              setFallbackQuizData(data.quizData); // This will trigger a re-render
            }
          } else {
            console.log("API fallback failed:", response.status);
          }
        } catch (error) {
          console.log("API fallback error:", error);
        } finally {
          setIsFetchingFallback(false);
        }
      };

      fetchQuizData();
    }, [isFetchingFallback]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Loading Results...
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {isFetchingFallback ? "Retrieving your quiz data..." : "Preparing your results..."}
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <AIInsightsProvider>
        <PaywallProvider>
          <BusinessModelScoresProvider>
            <Router>
              <NavigationGuardWrapper>
                <Analytics />
                <SpeedInsights />
                <Routes>
                  {/* Public routes with layout */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Index />
                      </Layout>
                    }
                  />
                  <Route
                    path="/business-explorer"
                    element={
                      <Layout>
                        <BusinessExplorer />
                      </Layout>
                    }
                  />
                  <Route
                    path="/explore"
                    element={
                      <Layout>
                        <BusinessExplorer />
                      </Layout>
                    }
                  />
                  <Route
                    path="/business-model/:id"
                    element={
                      <Layout>
                        <BusinessModelDetail />
                      </Layout>
                    }
                  />
                  <Route
                    path="/business-guide"
                    element={
                      <Layout>
                        <BusinessGuide />
                      </Layout>
                    }
                  />
                  <Route
                    path="/guide/:businessId"
                    element={
                      <Layout>
                        <BusinessGuide />
                      </Layout>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <Layout>
                        <ContactUs />
                      </Layout>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Layout>
                        <Login />
                      </Layout>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <Layout>
                        <ForgotPassword />
                      </Layout>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <Layout>
                        <ResetPassword />
                      </Layout>
                    }
                  />
                  <Route
                    path="/privacy-policy"
                    element={
                      <Layout>
                        <PrivacyPolicy />
                      </Layout>
                    }
                  />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Settings />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Direct routes (no layout) */}
                  <Route path="/quiz" element={<MainAppContent />} />
                  <Route path="/results" element={<MainAppContent />} />
                  <Route path="/quiz-loading" element={<MainAppContent />} />
                  <Route
                    path="/download-report"
                    element={
                      <Layout>
                        <DownloadReportPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/pdf-report"
                    element={
                      <Layout>
                        <PDFReportPage />
                      </Layout>
                    }
                  />

                  <Route path="/unsubscribe" element={<UnsubscribePage />} />

                  {/* Admin Page */}
                  <Route path="/admin" element={<AdminPage />} />

                  {/* Save Results Payment */}
                  <Route
                    path="/save-results-payment"
                    element={<SaveResultsPayment />}
                  />
                </Routes>
              </NavigationGuardWrapper>
            </Router>
          </BusinessModelScoresProvider>
        </PaywallProvider>
      </AIInsightsProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
