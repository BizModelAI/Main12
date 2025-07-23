import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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

interface AIAnalysis {
  fullAnalysis: string;
  keyInsights: string[];
  personalizedRecommendations: string[];
  successPredictors: string[];
  riskFactors: string[];
}

interface AIInsightsData {
  insights: AIInsights;
  analysis: AIAnalysis;
  timestamp: number;
  quizAttemptId?: number;
}

interface AIInsightsContextType {
  aiInsights: AIInsightsData | null;
  setAIInsights: (data: AIInsightsData) => void;
  clearAIInsights: () => void;
  isLoading: boolean;
}

const AIInsightsContext = createContext<AIInsightsContextType | undefined>(undefined);

export const useAIInsights = () => {
  const context = useContext(AIInsightsContext);
  if (context === undefined) {
    throw new Error('useAIInsights must be used within an AIInsightsProvider');
  }
  return context;
};

interface AIInsightsProviderProps {
  children: ReactNode;
}

export const AIInsightsProvider: React.FC<AIInsightsProviderProps> = ({ children }) => {
  const [aiInsights, setAIInsightsState] = useState<AIInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load AI insights from localStorage on mount (for page refreshes)
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem('ai-insights-data');
        
        if (stored) {
          const parsed = JSON.parse(stored);
          
          // Add null/undefined check before accessing timestamp
          if (parsed && typeof parsed.timestamp === 'number') {
            // Check if data is still valid (1 hour for anonymous users)
            const isExpired = Date.now() - parsed.timestamp > 60 * 60 * 1000;
            
            if (!isExpired) {
              setAIInsightsState(parsed);
            } else {
              localStorage.removeItem('ai-insights-data');
            }
          } else {
            // Remove invalid or corrupted data
            localStorage.removeItem('ai-insights-data');
          }
        } else {
        }
      } catch (error) {
        console.error('Error loading AI insights from storage:', error);
      }
    };

    loadFromStorage();
  }, []);

  const setAIInsights = (data: AIInsightsData) => {
    setAIInsightsState(data);
    // Store in localStorage immediately
    try {
      localStorage.setItem('ai-insights-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error storing AI insights in localStorage:', error);
    }
    // Background sync to database based on user type
    // NOTE: /api/ai-insights endpoint is not implemented in the new backend. Uncomment and implement if needed.
    /*
    syncToDatabase(data);
    */
  };

  // NOTE: /api/ai-insights endpoint is not implemented in the new backend. Uncomment and implement if needed.
  /*
  const syncToDatabase = async (data: AIInsightsData) => {
    if (!user) {
      // Anonymous user - only localStorage (1 hour)
      return;
    }
    try {
      // Get the latest quiz data from localStorage (or wherever it's stored)
      const quizDataRaw = localStorage.getItem('quizData');
      let quizData = null;
      if (quizDataRaw) {
        try {
          quizData = JSON.parse(quizDataRaw);
        } catch (e) {
          quizData = null;
        }
      }
      if (!quizData) {
        console.error('No quizData found for AI insights sync');
        return;
      }
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quizData }),
      });
      if (!response.ok) {
        console.error('Failed to sync AI insights to database');
      }
    } catch (error) {
      console.error('Error syncing AI insights to database:', error);
    }
  };
  */

  const clearAIInsights = () => {
    setAIInsightsState(null);
    localStorage.removeItem('ai-insights-data');
  };

  const value: AIInsightsContextType = {
    aiInsights,
    setAIInsights,
    clearAIInsights,
    isLoading,
  };

  return (
    <AIInsightsContext.Provider value={value}>
      {children}
    </AIInsightsContext.Provider>
  );
}; 