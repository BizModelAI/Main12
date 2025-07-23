import { QuizData, BusinessPath } from "../types";
import { businessPaths } from "../data/businessPaths";
import { apiPost } from "./apiClient";
import { businessModelService } from './businessModelService';

const API_BASE =
  "http://localhost:6000";

// AI-powered business fit analysis
export async function generateAIPersonalizedPaths(
  data: QuizData,
): Promise<BusinessPath[]> {
  try {
    console.log("generateAIPersonalizedPaths: Making AI analysis request");

    // Use XMLHttpRequest to avoid FullStory interference with fetch
    const response = await new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/api/ai-business-fit-analysis`, true);
      xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.timeout = 40000; // 40 second timeout (server has 35s)

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            console.error(
              "generateAIPersonalizedPaths: Invalid JSON response",
              e,
            );
            reject(new Error("Invalid JSON response"));
          }
        } else if (xhr.status === 429) {
          console.error("generateAIPersonalizedPaths: Rate limited");
          reject(new Error("Rate limited - too many requests"));
        } else {
          console.error(
            `generateAIPersonalizedPaths: API error ${xhr.status}:`,
            xhr.responseText,
          );
          reject(new Error(`API error: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        console.error("generateAIPersonalizedPaths: Network error");
        reject(new Error("Network error"));
      };
      xhr.ontimeout = () => {
        console.error(
          "generateAIPersonalizedPaths: Request timeout after 40 seconds",
        );
        reject(new Error("Request timeout"));
      };

      xhr.send(JSON.stringify({ quizData: data }));
    });

    const analysis = response;

    // Convert the AI analysis to BusinessPath format
    return analysis.topMatches.map((match: any) => ({
      ...match.businessPath,
      aiAnalysis: match.analysis,
      fitScore: match.analysis.fitScore,
    }));
  } catch (error) {
    console.error(
      "AI analysis failed, using BusinessModelService fallback:",
      error,
    );
    const matches = businessModelService.getBusinessModelMatches(data);
    return matches.map((match) => {
      const businessPath = businessPaths.find((path) => path.id === match.id);
      return { ...businessPath!, fitScore: match.score };
    });
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
