import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QuizData } from "../types";
import { AIService } from "../utils/aiService";
import { businessModelService } from "../utils/businessModelService";
import { getActionPlanForModel } from "../utils/hardcodedContent";

interface FullReportLoadingPageProps {
  quizData: QuizData;
  userEmail?: string | null;
  onComplete: (data: any) => void;
  onExit: () => void;
}

const MOTIVATIONAL_MESSAGE = "Starting a business is hard, but it's one of the best ways to take control of your future. Every successful entrepreneur began with an idea and the courage to try. Stay focused, learn fast, and keep going—progress comes from consistent action. You don't need to be perfect. You just need to start.";

export default function FullReportLoadingPage({
  quizData,
  userEmail,
  onComplete,
  onExit,
}: FullReportLoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFullReportData = async () => {
      try {
        console.log("🚀 Starting full report data generation...");
        
        // Step 1: Initialize
        setCurrentStep("Initializing...");
        setProgress(10);

        // Step 2: Get business model matches
        setCurrentStep("Analyzing your business matches...");
        setProgress(20);
        
        const businessMatches = businessModelService.getBusinessModelMatches(quizData);
        const topThreeAdvanced = businessMatches.slice(0, 3);
        const bottomThreeAdvanced = businessMatches.slice(-3); // Get bottom 3 models

        // Step 3: Copy data from Results page (localStorage first, then database)
        setCurrentStep("Loading your personalized insights...");
        setProgress(40);
        
        const resultsData = await getResultsPageData();

        // Step 4: Check if full report content already exists in database
        setCurrentStep("Checking for existing report...");
        setProgress(60);
        
        const aiService = AIService.getInstance();
        const quizAttemptId = localStorage.getItem("currentQuizAttemptId");
        let consolidatedContent;
        
        if (quizAttemptId) {
          // Check if full report content already exists
          const existingContent = await aiService.shouldGenerateAIContent("full-report", quizData, quizAttemptId);
          
          if (existingContent.existingContent && existingContent.existingContent.businessFitDescriptions) {
            console.log("📋 Found existing full report content in database");
            consolidatedContent = {
              businessFitDescriptions: existingContent.existingContent.businessFitDescriptions,
              businessAvoidDescriptions: existingContent.existingContent.businessAvoidDescriptions || {},
              potentialChallenges: existingContent.existingContent.potentialChallenges || [],
            };
          } else {
            // Generate new content
            setCurrentStep("Generating comprehensive analysis...");
            setProgress(65);
            
            consolidatedContent = await aiService.generateFullReportContent(
              quizData,
              topThreeAdvanced,
              bottomThreeAdvanced,
            );
          }
                  } else {
            // No quiz attempt ID, generate new content
            setCurrentStep("Generating comprehensive analysis...");
            setProgress(65);
            
            consolidatedContent = await aiService.generateFullReportContent(
              quizData,
              topThreeAdvanced,
              bottomThreeAdvanced,
            );
          }

                // Step 5: Save AI content to database (only if we generated new content)
        setCurrentStep("Saving your report...");
        setProgress(80);

        if (quizAttemptId) {
          // Check if we need to save (only if we generated new content)
          const existingContent = await aiService.shouldGenerateAIContent("full-report", quizData, quizAttemptId);
          
          if (!existingContent.existingContent || !existingContent.existingContent.businessFitDescriptions) {
            try {
              // Save the full report content to database
              await aiService.saveAIContentToDatabase(
                quizAttemptId,
                "full-report",
                {
                  businessFitDescriptions: consolidatedContent.businessFitDescriptions,
                  businessAvoidDescriptions: consolidatedContent.businessAvoidDescriptions,
                  potentialChallenges: consolidatedContent.potentialChallenges,
                  personalizedSummary: resultsData.personalizedSummary,
                  successPredictors: resultsData.successPredictors,
                  keyInsights: resultsData.keyInsights,
                  characteristics: resultsData.characteristics || [],
                  personalizedActionPlan: getActionPlanForModel(topThreeAdvanced[0]?.name || ""),
                  motivationalMessage: MOTIVATIONAL_MESSAGE,
                }
              );
              console.log("✅ Full report content saved to database");
            } catch (error) {
              console.error("❌ Error saving full report content to database:", error);
              // Continue even if database save fails
            }
          } else {
            console.log("📋 Full report content already exists in database, skipping save");
          }
        }

        // Step 6: Assemble complete data
        setCurrentStep("Finalizing your report...");
        setProgress(90);

        const completeData = {
          personalizedPaths: topThreeAdvanced.map((match) => ({
            id: match.id,
            name: match.name,
            fitScore: match.score,
          })),
          aiInsights: {
            // Copy from Results page data
            personalizedSummary: resultsData.personalizedSummary,
            successPredictors: resultsData.successPredictors,
            keyInsights: resultsData.keyInsights,
            
            // Generated by OpenAI
            businessFitDescriptions: consolidatedContent.businessFitDescriptions,
            businessAvoidDescriptions: consolidatedContent.businessAvoidDescriptions,
            potentialChallenges: consolidatedContent.potentialChallenges,
            
            // Hardcoded content
            personalizedActionPlan: getActionPlanForModel(topThreeAdvanced[0]?.name || ""),
            motivationalMessage: MOTIVATIONAL_MESSAGE,
          },
          allCharacteristics: resultsData.characteristics || [],
          businessFitDescriptions: consolidatedContent.businessFitDescriptions,
          businessAvoidDescriptions: consolidatedContent.businessAvoidDescriptions,
        };

        // Step 7: Complete
        setCurrentStep("Complete!");
        setProgress(100);

        // Small delay to show completion
        setTimeout(() => {
          onComplete(completeData);
        }, 500);

      } catch (error) {
        console.error("Error loading full report data:", error);
        setError("Failed to load report data. Please try again.");
      }
    };

    loadFullReportData();
  }, [quizData, userEmail, onComplete]);

  // Function to get data from Results page (localStorage first, then database)
  const getResultsPageData = async () => {
    try {
      // Try localStorage first
      const storedInsights = localStorage.getItem('quiz-completion-ai-insights');
      if (storedInsights) {
        const parsed = JSON.parse(storedInsights);
        if (parsed && parsed.insights && !parsed.error) {
          console.log("📋 Found Results page data in localStorage");
          return {
            personalizedSummary: parsed.insights.personalizedSummary || "Analysis not available",
            successPredictors: parsed.insights.successStrategies || [],
            keyInsights: parsed.insights.customRecommendations || [],
            characteristics: parsed.insights.characteristics || [],
          };
        }
      }

      // Fallback to database
      const quizAttemptId = localStorage.getItem("currentQuizAttemptId");
      if (quizAttemptId) {
        console.log("📋 Checking database for Results page data");
        const aiService = AIService.getInstance();
        const existingContent = await aiService.shouldGenerateAIContent("results-preview", quizData, quizAttemptId);
        
        if (existingContent.existingContent) {
                      return {
              personalizedSummary: existingContent.existingContent.personalizedSummary || "Analysis not available",
              successPredictors: existingContent.existingContent.successPredictors || [],
              keyInsights: existingContent.existingContent.keyInsights || [],
              characteristics: existingContent.existingContent.characteristics || [],
            };
        }
      }

      // Final fallback
      console.log("📋 Using fallback Results page data");
      return {
        personalizedSummary: "Based on your quiz responses, our analysis shows strong potential for entrepreneurial success. Your profile indicates a balanced approach to risk and opportunity.",
        successPredictors: ["Strong motivation and goal alignment", "Appropriate risk tolerance", "Realistic expectations"],
        keyInsights: ["Focus on your top-scoring business model", "Leverage your strong skills", "Start small and scale gradually"],
        characteristics: [],
      };
    } catch (error) {
      console.error("Error getting Results page data:", error);
      return {
        personalizedSummary: "Analysis not available",
        successPredictors: [],
        keyInsights: [],
        characteristics: [],
      };
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onExit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preparing Your Full Report</h1>
          <p className="text-gray-600">This will only take a moment...</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-700 font-medium"
          >
            {currentStep}
          </motion.p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mt-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This report is generated once per quiz attempt and includes your personalized business analysis.
          </p>
        </div>
      </div>
    </div>
  );
} 