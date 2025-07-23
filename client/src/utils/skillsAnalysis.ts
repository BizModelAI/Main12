import { QuizData } from "../types";

export interface SkillAssessment {
  skill: string;
  status: "have" | "working-on" | "need";
  confidence: number;
  reasoning: string;
}

export interface SkillsAnalysis {
  have: SkillAssessment[];
  workingOn: SkillAssessment[];
  need: SkillAssessment[];
}

export class SkillsAnalysisService {
  private static instance: SkillsAnalysisService;
  private apiKey: string;

  private constructor() {
    // API key will be handled server-side for security
    this.apiKey = "";
  }

  static getInstance(): SkillsAnalysisService {
    if (!SkillsAnalysisService.instance) {
      SkillsAnalysisService.instance = new SkillsAnalysisService();
    }
    return SkillsAnalysisService.instance;
  }

  // NOTE: /api/analyze-skills endpoint is not implemented in the new backend. Uncomment and implement if needed.
  /*
  async analyzeSkills(
    quizData: QuizData,
    requiredSkills: string[],
    businessModel: string,
  ): Promise<SkillsAnalysis> {
    try {
      const userProfile = this.createUserProfile(quizData);
      const payload = { quizData, requiredSkills, businessModel, userProfile };
      const response = await fetch('/api/analyze-skills', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error analyzing skills:', error);
      throw error;
    }
  }
  */

  private createUserProfile(quizData: QuizData): string {
    const profile = {
      motivation: quizData.mainMotivation,
      timeCommitment: quizData.weeklyTimeCommitment,
      learningStyle: quizData.learningPreference,
      skills: {
        tech: quizData.techSkillsRating || 3,
        communication: quizData.directCommunicationEnjoyment || 3,
        selfMotivation: quizData.selfMotivationLevel || 3,
        creativity: quizData.creativeWorkEnjoyment || 3,
        organization: quizData.organizationLevel || 3,
        resilience: quizData.discouragementResilience || 3,
      },
      preferences: {
        riskTolerance: quizData.riskComfortLevel || 3,
        collaboration: quizData.workCollaborationPreference,
        decisionStyle: quizData.decisionMakingStyle,
        consistency: quizData.longTermConsistency || 3,
      },
      tools: quizData.familiarTools?.slice(0, 3) || [],
    };

    return JSON.stringify(profile);
  }

  private processSkillAssessments(
    assessments: SkillAssessment[],
  ): SkillsAnalysis {
    const result: SkillsAnalysis = {
      have: [],
      workingOn: [],
      need: [],
    };

    assessments.forEach((assessment) => {
      switch (assessment.status) {
        case "have":
          result.have.push(assessment);
          break;
        case "working-on":
          result.workingOn.push(assessment);
          break;
        case "need":
          result.need.push(assessment);
          break;
      }
    });

    return result;
  }

  private getFallbackSkillsAnalysis(requiredSkills: string[]): SkillsAnalysis {
    // Distribute skills across categories for fallback
    const third = Math.ceil(requiredSkills.length / 3);

    return {
      have: requiredSkills.slice(0, third).map((skill) => ({
        skill,
        status: "have" as const,
        confidence: 7,
        reasoning:
          "Based on your quiz responses, you show strong aptitude for this skill",
      })),
      workingOn: requiredSkills.slice(third, third * 2).map((skill) => ({
        skill,
        status: "working-on" as const,
        confidence: 6,
        reasoning:
          "You have some experience but could benefit from further development",
      })),
      need: requiredSkills.slice(third * 2).map((skill) => ({
        skill,
        status: "need" as const,
        confidence: 8,
        reasoning: "This skill would need to be developed for optimal success",
      })),
    };
  }
}
