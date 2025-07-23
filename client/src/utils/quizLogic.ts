import { QuizData, BusinessPath } from "../types";
import { businessPaths } from "../data/businessPaths";
import { apiPost } from "./apiClient";
import { businessModelService } from './businessModelService';

// Use relative path for API_BASE
const API_BASE = "";

// AI-powered business fit analysis
export async function generateAIPersonalizedPaths(
  data: QuizData,
): Promise<BusinessPath[]> {
  try {
    console.log("generateAIPersonalizedPaths: Making AI analysis request");

    // Use fetch with credentials: 'include' for JWT auth
    const response = await fetch(`${API_BASE}/api/ai-business-fit-analysis`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error("generateAIPersonalizedPaths: Error", e);
    throw e;
  }
}

export function getNextAdaptiveQuestion(
  currentStep: number,
  data: Partial<QuizData>,
): boolean {
  // Simplified adaptive question logic
  if (currentStep === 4 && data.upfrontInvestment && data.upfrontInvestment > 500) {
    return true; // Show inventory comfort question
  }

  if (currentStep === 12 && (data.familiarTools?.includes("canva") || (data.creativeWorkEnjoyment ?? 0) >= 4)) {
    return true; // Show digital content comfort question
  }

  return false;
}
