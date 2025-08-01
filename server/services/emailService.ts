import { Resend } from "resend";
import type { QuizData } from "../../shared/types";
import { calculateAllBusinessModelMatches } from "../../shared/scoring";
import {
  calculatePersonalityScores,
  getPersonalityDescription,
} from "../../shared/personalityScoring";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Helper functions to convert stored numbers back to original quiz ranges
const getIncomeRangeLabel = (value: number): string => {
  if (value === 500) return "Less than $500";
  if (value === 1250) return "$500–$2,000";
  if (value === 3500) return "$2,000–$5,000";
  if (value === 7500) return "$5,000+";
  return `$${value}`;
};

// Import centralized utility functions
import { getInvestmentRange, getTimeCommitmentRange } from "../utils/quizUtils";

const getInvestmentRangeLabel = (value: number): string => {
  return getInvestmentRange(value);
};

const getTimeCommitmentRangeLabel = (value: number): string => {
  return getTimeCommitmentRange(value);
};

const getTimelineLabel = (value: string): string => {
  const labels: Record<string, string> = {
    "under-1-month": "Under 1 month",
    "1-3-months": "1–3 months",
    "3-6-months": "3–6 months",
    "no-rush": "No rush",
  };
  return labels[value] || value.replace("-", " ");
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  quizAttemptId?: number;
}

export class EmailService {
  private static instance: EmailService;
  private emailCache = new Map<string, { lastSent: number; count: number; firstEmailTime: number }>();
  private readonly INITIAL_COOLDOWN = 60 * 1000; // 1 minute for first 5 emails
  private readonly EXTENDED_COOLDOWN = 5 * 60 * 1000; // 5 minutes after first 5 emails
  private readonly INITIAL_EMAIL_LIMIT = 5; // First 5 emails get 1-minute cooldown

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async checkEmailRateLimit(email: string): Promise<boolean> {
    const result = await this.checkEmailRateLimitWithInfo(email);
    return result.allowed;
  }

  private async checkEmailRateLimitWithInfo(email: string): Promise<{ allowed: boolean; info?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    const now = Date.now();
    const emailKey = email.toLowerCase();
    const cached = this.emailCache.get(emailKey);

    if (!cached) {
      this.emailCache.set(emailKey, { lastSent: now, count: 1, firstEmailTime: now });
      return { allowed: true };
    }

    // Determine which cooldown period to use
    const isWithinInitialPeriod = cached.count <= this.INITIAL_EMAIL_LIMIT;
    const currentCooldown = isWithinInitialPeriod ? this.INITIAL_COOLDOWN : this.EXTENDED_COOLDOWN;
    const type = isWithinInitialPeriod ? 'cooldown' : 'extended';

    // Check if within cooldown period
    if (now - cached.lastSent < currentCooldown) {
      const remainingTime = currentCooldown - (now - cached.lastSent);
      console.log(`Email rate limit hit for ${email}: too soon since last email (${type} period)`);
      return { 
        allowed: false, 
        info: { 
          remainingTime: Math.ceil(remainingTime / 1000), // Convert to seconds
          type 
        } 
      };
    }

    // Update the cache with new email
    const newCount = cached.count + 1;
    this.emailCache.set(emailKey, { 
      lastSent: now, 
      count: newCount, 
      firstEmailTime: cached.firstEmailTime 
    });
    
    return { allowed: true };
  }

  private cleanupEmailCache(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [email, data] of this.emailCache.entries()) {
      if (data.lastSent < oneHourAgo) {
        this.emailCache.delete(email);
      }
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; rateLimitInfo?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    // Clean up old cache entries
    this.cleanupEmailCache();

    // Check rate limit
    const rateLimitCheck = await this.checkEmailRateLimitWithInfo(options.to);
    if (!rateLimitCheck.allowed) {
      console.log(`Rate limit exceeded for email: ${options.to}`);
      return { success: false, rateLimitInfo: rateLimitCheck.info };
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      
      // In development mode, log the email instead of failing
      if (process.env.NODE_ENV === "development") {
        console.log("=== EMAIL WOULD BE SENT (Development Mode) ===");
        console.log("To:", options.to);
        console.log("Subject:", options.subject);
        console.log("HTML Preview:", options.html.substring(0, 200) + "...");
        console.log("=== END EMAIL LOG ===");
        return { success: true }; // Return success in development mode
      }
      
      return { success: false };
    }

    try {
      console.log(`Attempting to send email to: ${options.to}`);
      console.log(`Subject: ${options.subject}`);

      if (!resend) {
        throw new Error("Resend API key not configured");
      }

      const { data, error } = await resend.emails.send({
        from: "BizModelAI <team@bizmodelai.com>",
        to: [options.to],
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        console.error("Resend API error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return { success: false };
      }

      console.log("Email sent successfully to:", options.to);
      console.log("Email ID:", data?.id);
      console.log("Email data:", data);
      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
      return { success: false };
    }
  }

  private async checkUnsubscribeStatus(email: string): Promise<boolean> {
    try {
      const { storage } = await import("../storage");
      const user = await storage.getUserByEmail(email);
      return user?.isUnsubscribed || false;
    } catch (error) {
      console.error("Error checking unsubscribe status:", error);
      return false; // Default to allowing emails if check fails
    }
  }

  async sendQuizResults(email: string, quizData: QuizData, quizAttemptId?: number, hasPaidForReport: boolean = false): Promise<{ success: boolean; rateLimitInfo?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    const subject = "Your BizModelAI Quiz Results";
    const html = hasPaidForReport 
      ? this.ResultsEmailTemplatePaid(quizData, quizAttemptId)
      : this.ResultsEmailTemplate(quizData, quizAttemptId);

    return await this.sendEmail({
      to: email,
      subject,
      html,
      quizAttemptId,
    });
  }

  async sendWelcomeEmail(email: string): Promise<{ success: boolean; rateLimitInfo?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    const subject = "Welcome to BizModelAI!";
    const html = this.generateWelcomeHTML();

    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendFullReport(email: string, quizData: QuizData, quizAttemptId?: number): Promise<{ success: boolean; rateLimitInfo?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    const subject = "Your Complete Business Report - BizModelAI";
    const html = this.generateFullReportHTML(quizData, quizAttemptId);

    return await this.sendEmail({
      to: email,
      subject,
      html,
      quizAttemptId,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
  ): Promise<{ success: boolean; rateLimitInfo?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    const subject = "Reset Your BizModelAI Password";
    const html = this.generatePasswordResetHTML(resetUrl);

    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendContactFormNotification(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
  }): Promise<{ success: boolean; rateLimitInfo?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    const subject = `New Contact Form: ${formData.subject}`;
    const html = this.generateContactFormNotificationHTML(formData);

    return await this.sendEmail({
      to: "team@bizmodelai.com",
      subject,
      html,
    });
  }

  async sendContactFormConfirmation(
    userEmail: string,
    userName: string,
  ): Promise<{ success: boolean; rateLimitInfo?: { remainingTime: number; type: 'cooldown' | 'extended' } }> {
    const subject = "We received your message - BizModelAI";
    const html = this.generateContactFormConfirmationHTML(userName);

    return await this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  private generateQuizResultsHTML(quizData: QuizData, quizAttemptId?: number): string {
    // Use the new ResultsEmailTemplate for consistency
    return this.ResultsEmailTemplate(quizData, quizAttemptId);
  }

  private getPersonalizedSnapshot(quizData: QuizData): string[] {
    if (!quizData) return [
      'Prefer flexibility with structure',
      'Thrive on independent projects',
      'Are motivated by financial freedom',
      'Learn best by doing',
      'Adapt quickly to new tools and systems',
      'Value passion and personal meaning in your work',
    ];
    const lines: string[] = [];
    
    // 1. Work structure
    if (quizData.workStructurePreference === 'some-structure' || quizData.workStructurePreference === 'mix-both') {
      lines.push('Prefer flexibility with structure');
    } else if (quizData.workStructurePreference === 'full-structure') {
      lines.push('Prefer clear structure and routines');
    } else {
      lines.push('Comfortable with flexible or unstructured work');
    }
    
    // 2. Collaboration
    if (quizData.workCollaborationPreference === 'mostly-solo' || quizData.workCollaborationPreference === 'solo-flexible') {
      lines.push('Thrive on independent projects');
    } else if (quizData.workCollaborationPreference === 'team') {
      lines.push('Enjoy collaborating with others');
    } else {
      lines.push('Open to both solo and team work');
    }
    
    // 3. Motivation
    if (quizData.mainMotivation === 'financial-freedom') {
      lines.push('Are motivated by financial freedom');
    } else if (quizData.mainMotivation === 'passion' || quizData.passionIdentityAlignment >= 4) {
      lines.push('Driven by passion and personal meaning');
    } else {
      lines.push('Motivated by growth and new challenges');
    }
    
    // 4. Learning style
    if (quizData.learningPreference === 'hands-on') {
      lines.push('Learn best by doing');
    } else if (quizData.learningPreference === 'after-some-research') {
      lines.push('Prefer to research before taking action');
    } else {
      lines.push('Adapt learning style to the situation');
    }
    
    // 5. Tech skills/adaptability
    if (quizData.techSkillsRating >= 4) {
      lines.push('Confident with technology and new tools');
    } else if (quizData.techSkillsRating === 3) {
      lines.push('Comfortable with most digital tools');
    } else {
      lines.push('Willing to learn new technology as needed');
    }
    
    // 6. Resilience/self-motivation
    if (quizData.longTermConsistency >= 4 || quizData.selfMotivationLevel >= 4) {
      lines.push('Highly self-motivated and consistent');
    } else if (quizData.longTermConsistency === 3) {
      lines.push('Stay motivated with clear goals and support');
    } else {
      lines.push('Working to build consistency and motivation');
    }
    
    return lines.slice(0, 6);
  }

  private getTopBusinessPaths(quizData: QuizData) {
    // Return first 3 business paths from personalized paths
    return this.getPersonalizedPaths(quizData).slice(0, 3);
  }

  public ResultsEmailTemplate(quizData: QuizData, quizAttemptId?: number): string {
    const topPaths = this.getTopBusinessPaths(quizData);
    const snapshotLines = this.getPersonalizedSnapshot(quizData);
    const resultsLink = quizAttemptId
      ? `${process.env.FRONTEND_URL || "https://bizmodelai.com"}/results?quizAttemptId=${quizAttemptId}`
      : `${process.env.FRONTEND_URL || "https://bizmodelai.com"}/results`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Your BizModelAI Results</title>
        </head>
        <body style="background: #f4f6fa; min-height: 100vh; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; margin: 0;">
          <div style="max-width: 700px; margin: 40px auto 0 auto; border-radius: 24px; box-shadow: 0 8px 32px rgba(37, 99, 235, 0.10); background: #fff; overflow: hidden;">
            <!-- Gradient Hero with Centered Logo -->
            <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #7c3aed 100%); padding: 56px 32px 56px 32px; text-align: center; border-radius: 0; margin: 0;">
              <div style="font-size: 54px; margin-bottom: 10px; margin-top: 0;">🎉</div>
              <h1 style="font-size: 36px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; line-height: 1.1;">Your AI-Powered Business Blueprint</h1>
              <p style="color: #e0e7ef; font-size: 15px; margin: 18px 0 0 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Personalized recommendations based on your unique goals, skills, and preferences</p>
            </div>
            <div style="padding: 40px 32px 32px 32px; background: #fff; border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
              <!-- Add preview/description meta for email (invisible, for inbox snippet) -->
              <div style="display: none; color: #fff;">Your personalized business model results are ready! See your best fit, AI insights, and how to unlock your full report.</div>
              
              ${topPaths[0] ? `
                <div style="margin-bottom: 32px; border-radius: 16px; border: none; box-shadow: 0 8px 32px rgba(30, 41, 59, 0.18); padding: 40px 40px 24px 40px; background: #f1f5f9; text-align: left; position: relative; transition: box-shadow 0.2s; min-height: 140px; display: flex; flex-direction: column; justify-content: center;">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 18px;">
                      <span style="font-size: 38px; margin-right: 8px;">${topPaths[0].emoji || '💡'}</span>
                      <h3 style="font-size: 27px; font-weight: 900; color: #18181b; margin: 0; letter-spacing: -0.01em; line-height: 1.1;">${topPaths[0].name}</h3>
                    </div>
                    <div style="text-align: center; margin-left: 18px;">
                      <div style="font-weight: 900; font-size: 32px; color: #6366f1; line-height: 1;">${topPaths[0].fitScore}%</div>
                      <div style="font-weight: 500; font-size: 15px; color: #64748b; line-height: 1; margin-top: 6px;">AI Match</div>
                    </div>
                  </div>
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 700; color: #6366f1; font-size: 16px; margin-bottom: 6px;">Top Benefits</div>
                    <ul style="color: #334155; font-size: 15px; margin: 0; padding: 0 0 0 18px; line-height: 1.7; list-style: disc;">
                      ${(topPaths[0].pros ? topPaths[0].pros.slice(0, 3) : []).map((pro: string) => `<li style="margin-bottom: 6px;">${pro}</li>`).join('')}
                    </ul>
                  </div>
                  <p style="color: #18181b; font-size: 16px; margin-bottom: 24px; line-height: 1.7;">${topPaths[0].detailedDescription || topPaths[0].description}</p>
                </div>
              ` : ''}
              
              <!-- Message to unlock more matches -->
              <div style="background: #f1f5f9; border-radius: 16px; margin: 0 0 32px 0; padding: 14px 32px; box-shadow: 0 8px 32px rgba(30,41,59,0.18); border: none; text-align: center; color: #18181b; font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                <span style="margin-right: 8px;">🔒</span>Get more business model matches by purchasing the full report.
              </div>
              
              <!-- Personalized Snapshot -->
              <div style="background: #f1f5f9; border-radius: 16px; margin: 0 0 32px 0; padding: 28px 32px; box-shadow: 0 8px 32px rgba(30,41,59,0.18); border: none; text-align: left;">
                <div style="font-weight: 700; font-size: 18px; color: #18181b; display: flex; align-items: center; gap: 8px; margin-bottom: 10px;"><span>📝</span>Personalized Snapshot</div>
                <div style="border-top: 1px solid #e5e7eb; margin: 0 0 18px 0; height: 1px;"></div>
                <ul style="color: #18181b; font-size: 15px; margin: 0; padding: 0 0 0 18px; line-height: 1.7; list-style: disc;">
                  ${snapshotLines.map((line: string) => `<li style="margin-bottom: 6px;">${line}</li>`).join('')}
                </ul>
              </div>
              
              <!-- Unlock section -->
              <div style="background: #f1f5f9; border-radius: 16px; margin: 0 0 32px 0; padding: 28px 32px; box-shadow: 0 8px 32px rgba(30,41,59,0.18); border: none; text-align: left; color: #18181b; font-size: 16px;">
                <div style="font-weight: 700; font-size: 18px; display: flex; align-items: center; gap: 8px; color: #18181b; margin-bottom: 10px;"><span>📈</span>Unlock Your Full Report To Access:</div>
                <div style="border-top: 1px solid #e5e7eb; margin: 0 0 18px 0; height: 1px;"></div>
                <ul style="color: #18181b; font-size: 15px; margin: 0; padding: 0 0 0 18px; line-height: 1.7; list-style: disc;">
                  <li>Business model fit scores & reasoning</li>
                  <li>Projected income & startup costs</li>
                  <li>AI-generated pros/cons per model</li>
                  <li>Personalized step-by-step launch plans</li>
                  <li>Lifetime access to all 25 business guides</li>
                  <li>30-day action roadmap</li>
                </ul>
              </div>
              
              <!-- Welcome message -->
              <div style="background: #f1f5f9; border-radius: 16px; box-shadow: 0 8px 32px rgba(30,41,59,0.18); margin: 0 0 32px 0; padding: 28px 32px; font-size: 16px; color: #18181b; font-style: italic; text-align: left; line-height: 1.7; position: relative;">
                <div style="margin-bottom: 8px; font-weight: 600;">Dear User,</div>
                <div>
                  Thanks for taking the BizModelAI quiz. Based on your responses, our system has carefully analyzed your skills, preferences, and entrepreneurial traits to identify the business models that best align with your goals. This personalized analysis is designed to help you take action with clarity and confidence—so you can stop second-guessing and start building a business that fits who you are and where you want to go.
                </div>
                <div style="text-align: right; margin-top: 16px; font-style: italic; font-weight: 500; display: flex; justify-content: flex-end; align-items: center;">
                  <span style="text-align: right;">With love,<br/>The BizModelAI Team 💌</span>
                </div>
              </div>
              
              <!-- Unlock button -->
              <div style="margin: 48px 0 0 0; text-align: center;">
                <a href="${resultsLink}" style="display: inline-block; background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); color: #fff; padding: 20px 48px; border-radius: 999px; font-weight: 900; font-size: 22px; text-decoration: none; box-shadow: 0 6px 24px rgba(59,130,246,0.13); letter-spacing: -0.01em; margin-bottom: 14px;">👉 Unlock My Full Report</a>
                <div style="color: #2563eb; font-weight: 700; font-size: 18px; margin: 18px 0 8px 0;">Only $9.99 — One-time payment for lifetime access</div>
                <!-- Data Retention Notice -->
                <div style="color: #64748b; font-size: 14px; margin: 14px auto 32px auto; text-align: center; background: none; max-width: 480px;">
                  <strong>Data Retention Notice:</strong> Your quiz results and data will be stored securely for 3 months from today. After this period, your data will be automatically deleted from our systems unless you create a paid account.
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="width: 100%; margin: 0 0 0 0; padding: 0; text-align: center;">
            <div style="background: #1e293b; border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; padding: 32px 0 24px 0; color: #fff; margin: 0 auto; box-shadow: 0 2px 12px rgba(30,41,59,0.10); width: 90%; max-width: 700px;">
              <!-- Centered logo and BizModelAI title -->
              <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin: 0 auto 0 auto; width: fit-content;">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F8eb83e4a630e4b8d86715228efeb581b%2F8de3245c79ad43b48b9a59be9364a64e?format=webp&width=60" alt="BizModelAI Logo" style="width: 36px; height: 36px; border-radius: 8px; background: none; margin: 0 0 0 0; display: block;" />
                <span style="font-weight: 800; font-size: 20px; letter-spacing: -0.01em; color: #fff;">BizModelAI</span>
              </div>
              <!-- More space between logo/title and social icons -->
              <div style="height: 18px;"></div>
              <div style="color: #cbd5e1; font-size: 14px; margin-top: 18px; margin-bottom: 0;">
                Need help or have questions? Just reply to this email or contact team@bizmodelai.com.<br />
                Your preview is saved for the next 90 days.
              </div>
              <!-- Socials: 4 icons, centered, light gray, now below help text -->
              <div style="margin: 18px 0 18px 0; display: flex; justify-content: center; gap: 22px;">
                <a href="https://www.tiktok.com/@bizmodelai" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
                <a href="https://www.instagram.com/bizmodelai/" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
                <a href="https://twitter.com/bizmodelai" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X (Twitter)" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
                <a href="https://www.pinterest.com/bizmodelai/" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/pinterest.svg" alt="Pinterest" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
              </div>
              <div style="margin-top: 18px;"></div>
              
              <!-- Divider below Unsubscribe -->
              <div style="border-top: 1px solid #334155; margin: 24px 0 0 0; height: 1px; width: 80%; margin-left: 10%; margin-right: 10%;"></div>
              <div style="color: #94a3b8; font-size: 13px; margin-top: 18px;">&copy; 2025 BizModelAI. All rights reserved.</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  public ResultsEmailTemplatePaid(quizData: QuizData, quizAttemptId?: number): string {
    const topPaths = this.getTopBusinessPaths(quizData);
    const snapshotLines = this.getPersonalizedSnapshot(quizData);
    const resultsLink = quizAttemptId
      ? `${process.env.FRONTEND_URL || "https://bizmodelai.com"}/results?quizAttemptId=${quizAttemptId}`
      : `${process.env.FRONTEND_URL || "https://bizmodelai.com"}/results`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Your Complete BizModelAI Report</title>
        </head>
        <body style="background: #f4f6fa; min-height: 100vh; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; margin: 0;">
          <div style="max-width: 700px; margin: 40px auto 0 auto; border-radius: 24px; box-shadow: 0 8px 32px rgba(37, 99, 235, 0.10); background: #fff; overflow: hidden;">
            <!-- Gradient Hero with Centered Logo -->
            <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #7c3aed 100%); padding: 56px 32px 56px 32px; text-align: center; border-radius: 0; margin: 0;">
              <div style="font-size: 54px; margin-bottom: 10px; margin-top: 0;">🎉</div>
              <h1 style="font-size: 36px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; line-height: 1.1;">Your AI-Powered Business Blueprint</h1>
              <p style="color: #e0e7ef; font-size: 15px; margin: 18px 0 0 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Personalized recommendations based on your unique goals, skills, and preferences</p>
            </div>
            <div style="padding: 40px 32px 32px 32px; background: #fff; border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
              <!-- Show all 3 business model cards -->
              <div style="display: none; color: #fff;">Your personalized business model results are ready! See your best fit, AI insights, and your full report.</div>
              ${topPaths.map((path, idx) => `
                <div style="margin-bottom: 32px; border-radius: 16px; border: none; box-shadow: 0 8px 32px rgba(30, 41, 59, 0.18); padding: 40px 40px 24px 40px; background: #f1f5f9; text-align: left; position: relative; transition: box-shadow 0.2s; min-height: 140px; display: flex; flex-direction: column; justify-content: center;">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 18px;">
                      <span style="font-size: 38px; margin-right: 8px;">${path.emoji || '💡'}</span>
                      <h3 style="font-size: 27px; font-weight: 900; color: #18181b; margin: 0; letter-spacing: -0.01em; line-height: 1.1;">${path.name}</h3>
                    </div>
                    <div style="text-align: center; margin-left: 18px;">
                      <div style="font-weight: 900; font-size: 32px; color: #6366f1; line-height: 1;">${path.fitScore}%</div>
                      <div style="font-weight: 500; font-size: 15px; color: #64748b; line-height: 1; margin-top: 6px;">AI Match</div>
                    </div>
                  </div>
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 700; color: #6366f1; font-size: 16px; margin-bottom: 6px;">Top Benefits</div>
                    <ul style="color: #334155; font-size: 15px; margin: 0; padding: 0 0 0 18px; line-height: 1.7; list-style: disc;">
                      ${(path.pros ? path.pros.slice(0, 3) : []).map((pro: string) => `<li style="margin-bottom: 6px;">${pro}</li>`).join('')}
                    </ul>
                  </div>
                  <p style="color: #18181b; font-size: 16px; margin-bottom: 24px; line-height: 1.7;">${path.detailedDescription || path.description}</p>
                </div>
              `).join('')}
              
              <!-- Personalized Snapshot -->
              <div style="background: #f1f5f9; border-radius: 16px; margin: 0 0 32px 0; padding: 28px 32px; box-shadow: 0 8px 32px rgba(30,41,59,0.18); border: none; text-align: left;">
                <div style="font-weight: 700; font-size: 18px; color: #18181b; display: flex; align-items: center; gap: 8px; margin-bottom: 10px;"><span>📝</span>Personalized Snapshot</div>
                <div style="border-top: 1px solid #e5e7eb; margin: 0 0 18px 0; height: 1px;"></div>
                <ul style="color: #18181b; font-size: 15px; margin: 0; padding: 0 0 0 18px; line-height: 1.7; list-style: disc;">
                  ${snapshotLines.map((line: string) => `<li style="margin-bottom: 6px;">${line}</li>`).join('')}
                </ul>
              </div>
              
              <!-- Welcome message -->
              <div style="background: #f1f5f9; border-radius: 16px; box-shadow: 0 8px 32px rgba(30,41,59,0.18); margin: 0 0 32px 0; padding: 28px 32px; font-size: 16px; color: #18181b; font-style: italic; text-align: left; line-height: 1.7; position: relative;">
                <div style="margin-bottom: 8px; font-weight: 600;">Dear User,</div>
                <div>
                  Thanks for taking the BizModelAI quiz. Based on your responses, our system has carefully analyzed your skills, preferences, and entrepreneurial traits to identify the business models that best align with your goals. This personalized analysis is designed to help you take action with clarity and confidence—so you can stop second-guessing and start building a business that fits who you are and where you want to go.
                </div>
                <div style="text-align: right; margin-top: 16px; font-style: italic; font-weight: 500; display: flex; justify-content: flex-end; align-items: center;">
                  <span style="text-align: right;">With love,<br/>The BizModelAI Team 💌</span>
                </div>
              </div>
              
              <!-- View Full Results button for paid users -->
              <div style="text-align: center; margin: 0 0 32px 0;">
                <a href="${resultsLink}" style="display: inline-block; background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); color: #fff; padding: 16px 40px; border-radius: 999px; font-weight: 900; font-size: 20px; text-decoration: none; box-shadow: 0 6px 24px rgba(59,130,246,0.13); letter-spacing: -0.01em; margin-top: 0;">View Full Results</a>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="width: 100%; margin: 0 0 0 0; padding: 0; text-align: center;">
            <div style="background: #1e293b; border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; padding: 32px 0 24px 0; color: #fff; margin: 0 auto; box-shadow: 0 2px 12px rgba(30,41,59,0.10); width: 90%; max-width: 700px;">
              <!-- Centered logo and BizModelAI title -->
              <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin: 0 auto 0 auto; width: fit-content;">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F8eb83e4a630e4b8d86715228efeb581b%2F8de3245c79ad43b48b9a59be9364a64e?format=webp&width=60" alt="BizModelAI Logo" style="width: 36px; height: 36px; border-radius: 8px; background: none; margin: 0 0 0 0; display: block;" />
                <span style="font-weight: 800; font-size: 20px; letter-spacing: -0.01em; color: #fff;">BizModelAI</span>
              </div>
              <!-- More space between logo/title and social icons -->
              <div style="height: 18px;"></div>
              <div style="color: #cbd5e1; font-size: 14px; margin-top: 18px; margin-bottom: 0;">
                Need help or have questions? Just reply to this email or contact team@bizmodelai.com.
              </div>
              <!-- Socials: 4 icons, centered, light gray, now below help text -->
              <div style="margin: 18px 0 18px 0; display: flex; justify-content: center; gap: 22px;">
                <a href="https://www.tiktok.com/@bizmodelai" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
                <a href="https://www.instagram.com/bizmodelai/" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
                <a href="https://twitter.com/bizmodelai" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X (Twitter)" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
                <a href="https://www.pinterest.com/bizmodelai/" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/pinterest.svg" alt="Pinterest" style="width: 26px; height: 26px; filter: brightness(0) invert(0.7);" />
                </a>
              </div>
              <div style="margin-top: 18px;"></div>
              
              <!-- Divider below Unsubscribe -->
              <div style="border-top: 1px solid #334155; margin: 24px 0 0 0; height: 1px; width: 80%; margin-left: 10%; margin-right: 10%;"></div>
              <div style="color: #94a3b8; font-size: 13px; margin-top: 18px;">&copy; 2025 BizModelAI. All rights reserved.</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private formatMotivation(motivation: string): string {
    const motivationMap: { [key: string]: string } = {
      "financial-freedom": "Financial Freedom",
      "flexible-schedule": "Flexible Schedule",
      "passion-project": "Passion Project",
      "career-change": "Career Change",
      "side-income": "Side Income",
      "creative-expression": "Creative Expression",
    };
    return motivationMap[motivation] || motivation;
  }

  private formatTimeline(timeline: string): string {
    const timelineMap: { [key: string]: string } = {
      immediately: "Immediately",
      "1-3-months": "1-3 Months",
      "3-6-months": "3-6 Months",
      "6-12-months": "6-12 Months",
      "1-year-plus": "1+ Years",
    };
    return timelineMap[timeline] || timeline;
  }



  private getPersonalizedPaths(quizData: QuizData): Array<{
    id: string;
    name: string;
    description: string;
    fitScore: number;
    difficulty: string;
    timeToProfit: string;
    startupCost: string;
    potentialIncome: string;
    emoji?: string;
    pros?: string[];
    detailedDescription?: string;
  }> {
    // Use the same scoring algorithm as the frontend
    const scoredBusinessModels = calculateAllBusinessModelMatches(quizData);

    // Map business model data with details
    const businessModelData: {
      [key: string]: {
        id: string;
        description: string;
        difficulty: string;
        timeToProfit: string;
        startupCost: string;
        potentialIncome: string;
        emoji?: string;
        pros?: string[];
        detailedDescription?: string;
      };
    } = {
      "Affiliate Marketing": {
        id: "affiliate-marketing",
        description:
          "Promote other people's products and earn commission on sales. Build trust with your audience and recommend products you genuinely believe in.",
        difficulty: "Easy",
        timeToProfit: "3-6 months",
        startupCost: "$0-$500",
        potentialIncome: "$500-$10,000+/month",
        emoji: "💰",
        pros: ["Low startup costs", "Passive income potential", "No inventory needed"],
        detailedDescription: "Promote other people's products and earn commission on sales. Build trust with your audience and recommend products you genuinely believe in."
      },
      "Content Creation / UGC": {
        id: "content-creation",
        description:
          "Create valuable content and monetize through multiple channels. Share your expertise, entertain, or educate your audience.",
        difficulty: "Medium",
        timeToProfit: "6-12 months",
        startupCost: "$200-$1,500",
        potentialIncome: "$1,000-$50,000+/month",
        emoji: "📱",
        pros: ["Creative freedom", "Multiple revenue streams", "Build personal brand"],
        detailedDescription: "Create valuable content and monetize through multiple channels. Share your expertise, entertain, or educate your audience."
      },
      "Online Coaching": {
        id: "online-coaching",
        description:
          "Share your expertise through 1-on-1 or group coaching programs. Help others achieve their goals while building a profitable business.",
        difficulty: "Medium",
        timeToProfit: "2-4 months",
        startupCost: "$100-$1,000",
        potentialIncome: "$2,000-$25,000+/month",
        emoji: "🎯",
        pros: ["High-value service", "Help others succeed", "Scalable business model"],
        detailedDescription: "Share your expertise through 1-on-1 or group coaching programs. Help others achieve their goals while building a profitable business."
      },

      Freelancing: {
        id: "freelancing",
        description:
          "Offer your skills and services to clients on a project basis. Turn your expertise into immediate income.",
        difficulty: "Easy",
        timeToProfit: "1-3 months",
        startupCost: "$0-$500",
        potentialIncome: "$1,000-$15,000+/month",
      },
      "Copywriting": {
        id: "copywriting",
        description:
          "Write persuasive marketing content that drives sales and conversions. Help businesses communicate effectively and increase revenue.",
        difficulty: "Medium",
        timeToProfit: "2-6 months",
        startupCost: "$0-$500",
        potentialIncome: "$2,000-$20,000+/month",
      },
      "Ghostwriting": {
        id: "ghostwriting",
        description:
          "Write content for others who publish under their own name. Help clients share their expertise and build authority.",
        difficulty: "Medium",
        timeToProfit: "2-8 months",
        startupCost: "$0-$300",
        potentialIncome: "$3,000-$30,000+/month",
      },
      "Social Media Marketing Agency": {
        id: "social-media-agency",
        description:
          "Help businesses grow their social media presence. Manage accounts, create content, and drive engagement.",
        difficulty: "Medium",
        timeToProfit: "3-6 months",
        startupCost: "$500-$2,000",
        potentialIncome: "$2,000-$30,000+/month",
      },
      "Virtual Assistant": {
        id: "virtual-assistant",
        description:
          "Provide administrative and business support remotely. Help entrepreneurs and businesses stay organized and efficient.",
        difficulty: "Easy",
        timeToProfit: "1-2 months",
        startupCost: "$0-$300",
        potentialIncome: "$800-$5,000+/month",
      },
      "High-Ticket Sales / Closing": {
        id: "high-ticket-sales",
        description:
          "Sell high-value products or services for businesses. Master the art of persuasion and earn substantial commissions.",
        difficulty: "Hard",
        timeToProfit: "3-9 months",
        startupCost: "$500-$2,000",
        potentialIncome: "$5,000-$50,000+/month",
      },
      "AI Marketing Agency": {
        id: "ai-marketing-agency",
        description:
          "Leverage AI tools to provide marketing solutions. Stay ahead of the curve with cutting-edge technology.",
        difficulty: "Medium",
        timeToProfit: "3-6 months",
        startupCost: "$300-$1,500",
        potentialIncome: "$2,000-$25,000+/month",
      },
      "Digital Services Agency": {
        id: "digital-services-agency",
        description:
          "Offer digital marketing and web services. Help businesses establish and grow their online presence.",
        difficulty: "Medium",
        timeToProfit: "3-6 months",
        startupCost: "$500-$2,000",
        potentialIncome: "$2,000-$30,000+/month",
      },
      "YouTube Automation Channels": {
        id: "youtube-automation",
        description:
          "Create and manage monetized YouTube channels. Build passive income through content creation and optimization.",
        difficulty: "Hard",
        timeToProfit: "6-18 months",
        startupCost: "$1,000-$5,000",
        potentialIncome: "$1,000-$20,000+/month",
      },
      "Investing / Trading": {
        id: "investing",
        description:
          "Generate income through financial markets. Build wealth through strategic investments and trading strategies.",
        difficulty: "Hard",
        timeToProfit: "6-24 months",
        startupCost: "$1,000-$10,000",
        potentialIncome: "$500-$50,000+/month",
      },
      "Online Reselling": {
        id: "online-reselling",
        description:
          "Buy and resell products online for profit. Find profitable products and scale your reselling business.",
        difficulty: "Easy",
        timeToProfit: "1-3 months",
        startupCost: "$500-$2,000",
        potentialIncome: "$1,000-$10,000+/month",
      },
      "Handmade Goods": {
        id: "handmade-goods",
        description:
          "Create and sell handcrafted products. Turn your creative skills into a profitable business.",
        difficulty: "Medium",
        timeToProfit: "3-6 months",
        startupCost: "$200-$1,500",
        potentialIncome: "$500-$8,000+/month",
      },
      "Amazon FBA": {
        id: "amazon-fba",
        description:
          "Sell products on Amazon using Fulfillment by Amazon. Focus on product selection while Amazon handles logistics.",
        difficulty: "Medium",
        timeToProfit: "2-8 months",
        startupCost: "$1,000-$10,000",
        potentialIncome: "$2,000-$50,000+/month",
      },
      "Podcasting": {
        id: "podcasting",
        description:
          "Create and monetize audio content through sponsorships and advertising. Build authority in your niche.",
        difficulty: "Medium",
        timeToProfit: "6-12 months",
        startupCost: "$100-$1,000",
        potentialIncome: "$500-$20,000+/month",
      },
      "Blogging": {
        id: "blogging",
        description:
          "Create written content to build audience and monetize through advertising and affiliate marketing.",
        difficulty: "Medium",
        timeToProfit: "6-12 months",
        startupCost: "$50-$500",
        potentialIncome: "$500-$15,000+/month",
      },
      "Consulting": {
        id: "consulting",
        description:
          "Provide expert advice and strategic guidance to businesses. Leverage your expertise for high-value services.",
        difficulty: "Hard",
        timeToProfit: "2-8 months",
        startupCost: "$0-$2,000",
        potentialIncome: "$5,000-$50,000+/month",
      },
      "Real Estate Investing": {
        id: "real-estate-investing",
        description:
          "Generate income through property investments including rentals and house flipping. Build wealth through real estate.",
        difficulty: "Hard",
        timeToProfit: "6-24 months",
        startupCost: "$10,000-$100,000+",
        potentialIncome: "$2,000-$50,000+/month",
      },
      "Online Course Creation": {
        id: "online-course-creation",
        description:
          "Create and sell educational courses online. Share your expertise and build passive income streams.",
        difficulty: "Medium",
        timeToProfit: "2-12 months",
        startupCost: "$100-$2,000",
        potentialIncome: "$1,000-$50,000+/month",
      },
      "E-commerce": {
        id: "e-commerce",
        description:
          "Build and sell products through your own online store. Have full control over branding and customer experience.",
        difficulty: "Medium",
        timeToProfit: "2-12 months",
        startupCost: "$500-$10,000",
        potentialIncome: "$2,000-$100,000+/month",
      },
      "Dropshipping": {
        id: "dropshipping",
        description:
          "Sell products online without holding inventory. Partner with suppliers who ship directly to customers.",
        difficulty: "Easy",
        timeToProfit: "1-4 months",
        startupCost: "$100-$2,000",
        potentialIncome: "$1,000-$20,000+/month",
      },
    };

    // Map scored models to detailed business paths
    return scoredBusinessModels.map((model) => {
      const modelData = businessModelData[model.name];
      return {
        id: modelData?.id || model.name.toLowerCase().replace(/\s+/g, "-"),
        name: model.name,
        description:
          modelData?.description ||
          "A business model tailored to your skills and goals",
        fitScore: Math.round(model.score),
        difficulty: modelData?.difficulty || "Medium",
        timeToProfit: modelData?.timeToProfit || "3-6 months",
        startupCost: modelData?.startupCost || "$100-$1,000",
        potentialIncome: modelData?.potentialIncome || "$1,000-$10,000+/month",
        emoji: modelData?.emoji || "💡",
        pros: modelData?.pros || ["Flexible schedule", "Low startup costs", "High growth potential"],
        detailedDescription: modelData?.detailedDescription || modelData?.description || "A business model tailored to your skills and goals",
      };
    });
  }

  private generateWelcomeHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Welcome to BizModelAI</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
                            <div class="logo" style="width: 70px; height: 70px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
                                <img src="https://cdn.builder.io/api/v1/image/assets%2F8eb83e4a630e4b8d86715228efeb581b%2F8de3245c79ad43b48b9a59be9364a64e?format=webp&width=800" alt="BizModelAI Logo" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: white; padding: 8px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);">
              </div>
              <h1>Welcome to BizModelAI!</h1>
              <p>Your journey to business success starts here</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 class="section-title">What's Next?</h2>
                <ul class="steps-list">
                  <li>Complete our comprehensive business assessment quiz</li>
                  <li>Get personalized business model recommendations</li>
                  <li>Access detailed implementation guides and resources</li>
                  <li>Download your complete business strategy report</li>
                </ul>
              </div>

              <div class="cta-container">
                <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/quiz" class="cta-button">
                  Start Your Assessment →
                </a>
                <p style="margin-top: 12px; font-size: 14px; color: #6B7280;">
                  Takes just 10-15 minutes to complete
                </p>
              </div>
            </div>

                        <div class="footer">
              <div class="footer-logo">BizModelAI</div>
              <div class="footer-tagline">Your AI-Powered Business Discovery Platform</div>

              <!-- Social Media Links -->
              <div class="social-media" style="margin-bottom: 20px;">
                <a href="https://www.instagram.com/bizmodelai/" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="Instagram" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
                <a href="https://www.tiktok.com/@bizmodelai" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg" alt="TikTok" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
                <a href="https://x.com/bizmodelai" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg" alt="X (Twitter)" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
                <a href="https://www.pinterest.com/bizmodelai/" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pinterest.svg" alt="Pinterest" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
              </div>

              <div class="footer-disclaimer">
                Ready to discover your perfect business path?<br>
                We're here to guide you every step of the way.
              </div>
              <div class="footer-unsubscribe">
                <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/unsubscribe" class="unsubscribe-link">
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
        `;
  }

  private generatePasswordResetHTML(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Reset Your Password - BizModelAI</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo" style="width: 70px; height: 70px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F8eb83e4a630e4b8d86715228efeb581b%2F8de3245c79ad43b48b9a59be9364a64e?format=webp&width=800" alt="BizModelAI Logo" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: white; padding: 8px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);">
              </div>
              <h1>Reset Your Password</h1>
              <p>We received a request to reset your BizModelAI password</p>
            </div>

            <div class="content">
              <div class="section">
                <p style="margin-bottom: 24px; color: #374151; line-height: 1.6;">
                  Click the button below to reset your password. This link will expire in 1 hour for security purposes.
                </p>

                <div class="cta-container">
                  <a href="${resetUrl}" class="cta-button">
                    Reset My Password
                  </a>
                </div>

                <div style="margin-top: 32px; padding: 20px; background: #F3F4F6; border-radius: 12px; border-left: 4px solid #F59E0B;">
                  <h3 style="margin: 0 0 12px; font-size: 16px; color: #92400E;">
                    Security Tips:
                  </h3>
                  <ul style="margin: 0; padding-left: 20px; color: #78350F;">
                    <li>This link expires in 1 hour</li>
                    <li>If you didn't request this reset, you can safely ignore this email</li>
                    <li>Never share your password with anyone</li>
                  </ul>
                </div>

                <p style="margin-top: 24px; font-size: 14px; color: #6B7280;">
                  If the button above doesn't work, copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #7C3AED; word-break: break-all;">${resetUrl}</a>
                </p>
              </div>
            </div>

                        <div class="footer">
              <div class="footer-logo">BizModelAI</div>
              <div class="footer-tagline">Your AI-Powered Business Discovery Platform</div>

              <!-- Social Media Links -->
              <div class="social-media" style="margin-bottom: 20px;">
                <a href="https://www.instagram.com/bizmodelai/" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="Instagram" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
                <a href="https://www.tiktok.com/@bizmodelai" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg" alt="TikTok" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
                <a href="https://x.com/bizmodelai" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg" alt="X (Twitter)" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
                <a href="https://www.pinterest.com/bizmodelai/" style="display: inline-block; margin: 0 8px; text-decoration: none;" target="_blank">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pinterest.svg" alt="Pinterest" style="width: 24px; height: 24px; filter: grayscale(1) brightness(0) invert(0.4);">
                </a>
              </div>

              <div class="footer-disclaimer">
                If you didn't request this password reset, please ignore this email.<br>
                Your account security is important to us.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateFullReportHTML(quizData: QuizData, quizAttemptId?: number): string {
    const personalizedPaths = this.getPersonalizedPaths(quizData);
    const top3Paths = personalizedPaths.slice(0, 3);
    const resultsLink = quizAttemptId
      ? `${process.env.FRONTEND_URL || "https://bizmodelai.com"}/results?quizAttemptId=${quizAttemptId}`
      : `${process.env.FRONTEND_URL || "https://bizmodelai.com"}/results`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Your Complete Business Report</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC !important; color: #000000 !important;">
          <div class="email-container" style="max-width: 800px; margin: 0 auto; background: #FFFFFF !important; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); border: 1px solid #E5E7EB;">
            <div class="header" style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 50px 40px; text-align: center; position: relative; overflow: hidden;">
                            <div class="logo" style="width: 70px; height: 70px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
                                <img src="https://cdn.builder.io/api/v1/image/assets%2F8eb83e4a630e4b8d86715228efeb581b%2F8de3245c79ad43b48b9a59be9364a64e?format=webp&width=800" alt="BizModelAI Logo" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: white; padding: 8px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);">
              </div>
              <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 12px; position: relative; z-index: 1; color: white !important;">Your AI-Powered Business Blueprint</h1>
              <p style="font-size: 18px; opacity: 0.95; position: relative; z-index: 1; color: white !important;">Complete Analysis & Implementation Guide</p>
            </div>
            
            <div class="content" style="padding: 50px 40px; background: #FFFFFF !important; color: #000000 !important;">
              
              <!-- AI-Generated Insights Section -->
              <div class="section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="font-size: 24px; font-weight: 600; color: #000000 !important; margin-bottom: 20px; display: flex; align-items: center;">
                  ✨ Your AI-Generated Insights
                </h2>
                <div class="ai-insights-card" style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); border-radius: 20px; padding: 30px; margin-bottom: 30px; color: white !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">
                  <div class="insights-content" style="color: white !important;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: white !important;">
                      <strong>Personalized Analysis:</strong> Based on your comprehensive assessment, <strong>${top3Paths[0].name}</strong> achieves a <strong>${top3Paths[0].fitScore}%</strong> compatibility score with your unique profile. Your goals, personality traits, and available resources align perfectly with this business model's requirements and potential outcomes.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: white !important;">
                      With your <strong>${this.formatMotivation(quizData.mainMotivation)}</strong> motivation and <strong>${getIncomeRangeLabel(quizData.successIncomeGoal)}</strong> income goal, you're positioned for success in the ${quizData.successIncomeGoal >= 5000 ? "high-growth" : "sustainable income"} category. Your ${getTimeCommitmentRangeLabel(quizData.weeklyTimeCommitment)} weekly commitment shows ${quizData.weeklyTimeCommitment >= 20 ? "strong dedication" : "balanced approach"} to building your business.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: white !important;">
                      Your ${quizData.techSkillsRating >= 4 ? "strong" : "adequate"} tech skills and ${quizData.learningPreference} learning preference indicate you're ${quizData.techSkillsRating >= 4 ? "technically capable and ready for advanced strategies" : "perfectly positioned for user-friendly business models"}. This combination creates an ideal foundation for ${top3Paths[0].name} success.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Top 3 Business Models Section -->
              <div class="section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="font-size: 24px; font-weight: 600; color: #000000 !important; margin-bottom: 20px; display: flex; align-items: center;">
                   Your Top 3 Business Matches
                </h2>
                
                ${top3Paths
                  .map(
                    (path, index) => `
                  <div class="business-card" style="background: #FFFFFF !important; border: 2px solid ${index === 0 ? "#F59E0B" : "#E5E7EB"}; border-radius: 20px; padding: 30px; margin-bottom: 24px; ${index === 0 ? "background: linear-gradient(135deg, #FEF3C7 0%, #FCD34D 5%, #FFFFFF 10%) !important;" : ""} box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);">
                    <div class="card-header" style="display: flex; align-items: center; margin-bottom: 20px;">
                      ${index === 0 ? '<div class="rank-badge" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white !important; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 12px;">BEST FIT</div>' : `<div class="rank-badge" style="background: #E5E7EB; color: #6B7280 !important; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 12px;">#${index + 1}</div>`}
                      <div class="score-badge" style="background: linear-gradient(135deg, #2563EB, #7C3AED); color: white !important; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">${path.fitScore}% Match</div>
                    </div>
                    
                    <h3 style="font-size: 20px; font-weight: 700; color: #000000 !important; margin-bottom: 12px;">${path.name}</h3>
                    <p style="font-size: 16px; color: #4B5563 !important; margin-bottom: 20px; line-height: 1.5;">${path.description}</p>
                    
                    <div class="path-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                      <div class="detail-item" style="background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB;">
                        <div style="font-size: 12px; color: #6B7280 !important; margin-bottom: 4px;">Difficulty</div>
                        <div style="font-weight: 600; color: #000000 !important;">${path.difficulty}</div>
                      </div>
                      <div class="detail-item" style="background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB;">
                        <div style="font-size: 12px; color: #6B7280 !important; margin-bottom: 4px;">Time to Profit</div>
                        <div style="font-weight: 600; color: #000000 !important;">${path.timeToProfit}</div>
                      </div>
                      <div class="detail-item" style="background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB;">
                        <div style="font-size: 12px; color: #6B7280 !important; margin-bottom: 4px;">Startup Cost</div>
                        <div style="font-weight: 600; color: #000000 !important;">${path.startupCost}</div>
                      </div>
                      <div class="detail-item" style="background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB;">
                        <div style="font-size: 12px; color: #6B7280 !important; margin-bottom: 4px;">Income Potential</div>
                        <div style="font-weight: 600; color: #000000 !important;">${path.potentialIncome}</div>
                      </div>
                    </div>
                    
                    <div class="cta-button-container" style="text-align: center; margin-top: 20px;">
                      <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/business-model/${path.id}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                        Learn More About ${path.name} →
                      </a>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>

              <!-- Key Recommendations Section -->
              <div class="section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="font-size: 24px; font-weight: 600; color: #000000 !important; margin-bottom: 20px; display: flex; align-items: center;">
                   Key Recommendations
                </h2>
                <div class="recommendations-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                  <div class="recommendation-card" style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 20px;">
                    <h4 style="font-weight: 600; color: #0369A1 !important; margin-bottom: 8px; display: flex; align-items: center;">
                       Best Strategy
                    </h4>
                    <p style="color: #1E40AF !important; font-size: 14px; line-height: 1.5;">
                      ${quizData.techSkillsRating >= 4 ? "Leverage your strong technical skills to build automated systems and scalable solutions" : "Focus on proven, user-friendly methods that don't require advanced technical knowledge"}
                    </p>
                  </div>
                  <div class="recommendation-card" style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 20px;">
                    <h4 style="font-weight: 600; color: #047857 !important; margin-bottom: 8px; display: flex; align-items: center;">
                      ⚡ Quick Win
                    </h4>
                    <p style="color: #065F46 !important; font-size: 14px; line-height: 1.5;">
                      ${quizData.learningPreference === "hands-on" ? "Start with a small pilot project to learn by doing and build momentum quickly" : "Invest time in comprehensive learning before launching to ensure solid foundation"}
                    </p>
                  </div>
                  <div class="recommendation-card" style="background: #FEF3C7; border: 1px solid #FDE047; border-radius: 12px; padding: 20px;">
                    <h4 style="font-weight: 600; color: #92400E !important; margin-bottom: 8px; display: flex; align-items: center;">
                       Growth Path
                    </h4>
                    <p style="color: #78350F !important; font-size: 14px; line-height: 1.5;">
                      ${quizData.riskComfortLevel >= 4 ? "Your high risk tolerance allows for aggressive growth strategies and innovative approaches" : "Focus on steady, proven growth methods that minimize risk while building confidence"}
                    </p>
                  </div>
                  <div class="recommendation-card" style="background: #F3E8FF; border: 1px solid #D8B4FE; border-radius: 12px; padding: 20px;">
                    <h4 style="font-weight: 600; color: #7C2D12 !important; margin-bottom: 8px; display: flex; align-items: center;">
                       Timeline
                    </h4>
                    <p style="color: #6B21A8 !important; font-size: 14px; line-height: 1.5;">
                      With ${getTimeCommitmentRangeLabel(quizData.weeklyTimeCommitment)} weekly commitment, expect ${quizData.weeklyTimeCommitment >= 20 ? "accelerated progress and faster results" : "steady progress with sustainable growth"}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Your Business Profile Section -->
              <div class="section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="font-size: 24px; font-weight: 600; color: #000000 !important; margin-bottom: 20px; display: flex; align-items: center;">
                   Your Business Profile
                </h2>
                <div class="profile-card" style="background: #FFFFFF !important; border: 1px solid #E5E7EB; border-radius: 16px; padding: 30px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);">
                  <div class="profile-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                      <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Main Motivation</span>
                      <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${this.formatMotivation(quizData.mainMotivation)}</span>
                    </div>
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                      <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Income Goal</span>
                      <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${getIncomeRangeLabel(quizData.successIncomeGoal)}</span>
                    </div>
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                      <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Timeline</span>
                      <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${this.formatTimeline(quizData.firstIncomeTimeline)}</span>
                    </div>
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                      <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Investment Budget</span>
                      <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${getInvestmentRangeLabel(quizData.upfrontInvestment)}</span>
                    </div>
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
                      <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Weekly Commitment</span>
                      <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${getTimeCommitmentRangeLabel(quizData.weeklyTimeCommitment)}</span>
                    </div>
                    <div class="profile-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0;">
                      <span class="profile-label" style="font-weight: 500; color: #6B7280 !important; font-size: 15px;">Tech Skills</span>
                      <span class="profile-value" style="font-weight: 600; color: #000000 !important; font-size: 15px;">${quizData.techSkillsRating >= 4 ? "Strong" : quizData.techSkillsRating >= 3 ? "Moderate" : "Basic"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div style="text-align: center; margin-top: 20px;">
                <a href="${resultsLink}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3); transition: all 0.3s ease;">
                  View Your Results →
                </a>
                <br>
                <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/dashboard" style="display: inline-block; background: #FFFFFF; color: #2563EB !important; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; border: 2px solid #2563EB;">
                  Go to Dashboard →
                </a>
              </div>
            </div>

                        <div class="footer" style="background: #1E293B !important; padding: 40px; text-align: center; border-top: 1px solid #334155;">
              <a href="https://bizmodelai.com" style="text-decoration: none;">
                <div class="footer-logo" style="font-size: 20px; font-weight: 700; color: #FFFFFF !important; margin-bottom: 10px;">BizModelAI</div>
              </a>
              <div class="footer-tagline" style="color: #D1D5DB !important; font-size: 16px; margin-bottom: 20px;">Your AI-Powered Business Discovery Platform</div>

                            <div class="footer-disclaimer" style="font-size: 14px; color: #9CA3AF !important; line-height: 1.5; margin-bottom: 16px;">
                This email was sent because you completed our business assessment quiz.<br>
                We're here to help you discover your perfect business path.
              </div>

              <div class="data-retention-notice" style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; color: #92400E !important; line-height: 1.4;">
                <strong> Data Retention Notice:</strong><br>
                Your quiz results and data will be stored securely for <strong>3 months</strong> from today. After this period, your data will be automatically deleted from our systems unless you create a paid account.<br><br>
                <strong>Want to keep your results forever?</strong> <a href="${resultsLink}" style="color: #92400E !important; text-decoration: underline;">Upgrade to unlock your full report</a> and your data will be saved permanently.
              </div>
              <div class="footer-unsubscribe" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155;">
                <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/unsubscribe" class="unsubscribe-link" style="color: #9CA3AF !important; text-decoration: none; font-size: 14px; padding: 8px 16px; border-radius: 6px;">
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateContactFormNotificationHTML(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC !important; color: #000000 !important;">
          <div class="email-container" style="max-width: 800px; margin: 0 auto; background: #FFFFFF !important; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); border: 1px solid #E5E7EB;">
            <div class="header" style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 40px; text-align: center;">
              <div class="logo" style="width: 70px; height: 70px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F8eb83e4a630e4b8d86715228efeb581b%2F8de3245c79ad43b48b9a59be9364a64e?format=webp&width=800" alt="BizModelAI Logo" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: white; padding: 8px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);">
              </div>
              <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 12px; color: white !important;">New Contact Form Submission</h1>
              <p style="font-size: 16px; opacity: 0.95; color: white !important;">From BizModelAI Contact Form</p>
            </div>

            <div class="content" style="padding: 40px; background: #FFFFFF !important; color: #000000 !important;">
              <div class="form-details" style="background: #F8FAFC; border-radius: 12px; padding: 30px; margin-bottom: 30px; border: 1px solid #E5E7EB;">
                <h2 style="font-size: 20px; font-weight: 600; color: #000000 !important; margin-bottom: 20px;">Contact Details</h2>

                <div class="detail-row" style="display: flex; margin-bottom: 16px; padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                  <span style="font-weight: 600; color: #374151 !important; width: 120px; flex-shrink: 0;">Name:</span>
                  <span style="color: #000000 !important;">${formData.name}</span>
                </div>

                <div class="detail-row" style="display: flex; margin-bottom: 16px; padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                  <span style="font-weight: 600; color: #374151 !important; width: 120px; flex-shrink: 0;">Email:</span>
                  <span style="color: #000000 !important;">${formData.email}</span>
                </div>

                <div class="detail-row" style="display: flex; margin-bottom: 16px; padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                  <span style="font-weight: 600; color: #374151 !important; width: 120px; flex-shrink: 0;">Category:</span>
                  <span style="color: #000000 !important;">${formData.category}</span>
                </div>

                <div class="detail-row" style="display: flex; margin-bottom: 16px; padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                  <span style="font-weight: 600; color: #374151 !important; width: 120px; flex-shrink: 0;">Subject:</span>
                  <span style="color: #000000 !important;">${formData.subject}</span>
                </div>
              </div>

              <div class="message-section" style="background: #FFFFFF; border: 2px solid #2563EB; border-radius: 12px; padding: 30px;">
                <h3 style="font-size: 18px; font-weight: 600; color: #2563EB !important; margin-bottom: 16px;">Message</h3>
                <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; border-left: 4px solid #2563EB;">
                  <p style="color: #000000 !important; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.message}</p>
                </div>
              </div>

              <div style="margin-top: 30px; padding: 20px; background: #F0F9FF; border-radius: 12px; border: 1px solid #BAE6FD;">
                <p style="color: #1E40AF !important; font-size: 14px; margin: 0; text-align: center;">
                  <strong>Reply to:</strong> ${formData.email}
                </p>
              </div>
            </div>

            <div class="footer" style="background: #1F2937 !important; padding: 30px; text-align: center; border-top: 1px solid #374151;">
              <div class="footer-logo" style="font-size: 18px; font-weight: 700; color: #FFFFFF !important; margin-bottom: 8px;">BizModelAI</div>
              <div style="color: #D1D5DB !important; font-size: 14px;">Contact Form Notification</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateContactFormConfirmationHTML(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <title>Message Received - BizModelAI</title>
          <style>
            ${this.getBrighterStyles()}
          </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC !important; color: #000000 !important;">
          <div class="email-container" style="max-width: 800px; margin: 0 auto; background: #FFFFFF !important; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); border: 1px solid #E5E7EB;">
            <div class="header" style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 50px 40px; text-align: center; position: relative; overflow: hidden;">
              <div class="logo" style="width: 70px; height: 70px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F8eb83e4a630e4b8d86715228efeb581b%2F8de3245c79ad43b48b9a59be9364a64e?format=webp&width=800" alt="BizModelAI Logo" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px; background: white; padding: 8px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);">
              </div>
              <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 12px; position: relative; z-index: 1; color: white !important;">Message Received!</h1>
              <p style="font-size: 18px; opacity: 0.95; position: relative; z-index: 1; color: white !important;">Thank you for reaching out to us</p>
            </div>

            <div class="content" style="padding: 50px 40px; background: #FFFFFF !important; color: #000000 !important;">
              <div class="section" style="margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 600; color: #000000 !important; margin-bottom: 20px;">Hi ${userName}! </h2>
                <p style="font-size: 16px; color: #374151 !important; line-height: 1.6; margin-bottom: 20px;">
                  We've successfully received your message and our team will review it shortly. We appreciate you taking the time to contact us.
                </p>
                <p style="font-size: 16px; color: #374151 !important; line-height: 1.6; margin-bottom: 30px;">
                  <strong>What happens next?</strong>
                </p>

                <div class="timeline" style="background: #F8FAFC; border-radius: 12px; padding: 30px; border: 1px solid #E5E7EB;">
                  <div class="timeline-item" style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #10B981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
                      <span style="color: white; font-weight: bold; font-size: 14px;">1</span>
                    </div>
                    <div>
                      <h4 style="color: #000000 !important; font-weight: 600; margin-bottom: 4px;">Review (Within 2 hours)</h4>
                      <p style="color: #6B7280 !important; font-size: 14px; margin: 0;">Our team will review your message and determine the best way to help.</p>
                    </div>
                  </div>

                  <div class="timeline-item" style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #2563EB, #7C3AED); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
                      <span style="color: white; font-weight: bold; font-size: 14px;">2</span>
                    </div>
                    <div>
                      <h4 style="color: #000000 !important; font-weight: 600; margin-bottom: 4px;">Response (Within 24 hours)</h4>
                      <p style="color: #6B7280 !important; font-size: 14px; margin: 0;">We'll send you a personalized response with the information you need.</p>
                    </div>
                  </div>

                  <div class="timeline-item" style="display: flex; align-items: flex-start;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #F59E0B, #D97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
                      <span style="color: white; font-weight: bold; font-size: 14px;">3</span>
                    </div>
                    <div>
                      <h4 style="color: #000000 !important; font-weight: 600; margin-bottom: 4px;">Follow-up (If needed)</h4>
                      <p style="color: #6B7280 !important; font-size: 14px; margin: 0;">We may reach out with additional questions or resources to better assist you.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px; border: 1px solid #BAE6FD;">
                <h3 style="color: #1E40AF !important; font-size: 18px; font-weight: 600; margin-bottom: 16px;">While you wait...</h3>
                <p style="color: #1E3A8A !important; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                  Explore our business assessment quiz to discover your perfect business model match, or browse our comprehensive business guides.
                </p>
                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/quiz" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin-right: 12px;">
                    Take the Quiz →
                  </a>
                  <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/explore" style="display: inline-block; background: #FFFFFF; color: #2563EB !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 2px solid #2563EB;">
                    Explore Models
                  </a>
                </div>
              </div>

              <div style="text-align: center; padding: 20px;">
                <p style="color: #6B7280 !important; font-size: 14px; margin: 0;">
                  Need immediate assistance? Check out our <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/help" style="color: #2563EB !important; text-decoration: none;">Help Center</a>
                </p>
              </div>
            </div>

            <div class="footer" style="background: #FFFFFF !important; padding: 40px; text-align: center; border-top: 1px solid #F3F4F6;">
              <div class="footer-logo" style="font-size: 20px; font-weight: 700; color: #000000 !important; margin-bottom: 10px;">BizModelAI</div>
              <div class="footer-tagline" style="color: #6B7280 !important; font-size: 16px; margin-bottom: 20px;">Your AI-Powered Business Discovery Platform</div>

              <div class="footer-disclaimer" style="font-size: 14px; color: #9CA3AF !important; line-height: 1.5; margin-bottom: 16px;">
                This confirmation email was sent because you contacted us through our website.<br>
                We're committed to helping you discover your perfect business path.
              </div>
              <div class="footer-unsubscribe" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #F3F4F6;">
                <a href="${process.env.FRONTEND_URL || "https://bizmodelai.com"}/unsubscribe" class="unsubscribe-link" style="color: #6B7280 !important; text-decoration: none; font-size: 14px; padding: 8px 16px; border-radius: 6px;">
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getBrighterStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      /* Force light mode - prevent email clients from applying dark mode styles */
      [data-ogsc] * {
        color: inherit !important;
        background-color: inherit !important;
      }
      
      [data-ogsb] * {
        color: inherit !important;
        background-color: inherit !important;
      }
      
      /* Outlook dark mode overrides */
      [data-outlook-cycle] * {
        color: inherit !important;
        background-color: inherit !important;
      }
      
      /* Apple Mail dark mode overrides */
      @media (prefers-color-scheme: dark) {
        .email-container {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .content {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .footer {
          background-color: #1F2937 !important;
          color: #FFFFFF !important;
        }
        
        .profile-card {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .top-match-card {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        
        .section-title {
          color: #000000 !important;
        }
        
        .match-name {
          color: #000000 !important;
        }
        
        .match-description {
          color: #333333 !important;
        }
        
        .profile-value {
          color: #000000 !important;
        }
        
        .steps-list li {
          color: #000000 !important;
        }
        
        .footer-logo {
          color: #FFFFFF !important;
        }
        
        .footer-tagline {
          color: #D1D5DB !important;
        }
        
        .footer-disclaimer {
          color: #9CA3AF !important;
        }
        
        body {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
      }
      
      /* Gmail dark mode overrides */
      u + .body .email-container {
        background-color: #FFFFFF !important;
        color: #000000 !important;
      }
      
      /* Additional dark mode prevention */
      .ExternalClass {
        width: 100%;
      }
      
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      
      /* Force white background on all containers */
      table, td, div, p, span {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      
      /* Meta tags to prevent dark mode */
      meta[name="color-scheme"] {
        content: light !important;
      }
      
      meta[name="supported-color-schemes"] {
        content: light !important;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #000000;
        background-color: #FFFFFF;
        padding: 20px;
      }
      
      .email-container {
        max-width: 800px;
        margin: 0 auto;
        background: #FFFFFF;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        border: 1px solid #E5E7EB;
      }
      
      .header {
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: white;
        padding: 50px 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
        animation: pulse 4s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.05); opacity: 0.9; }
      }
      
      .logo {
        width: 70px;
        height: 70px;
        margin: 0 auto 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      }
      
      .header h1 {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 12px;
        position: relative;
        z-index: 1;
      }
      
      .header p {
        font-size: 18px;
        opacity: 0.95;
        position: relative;
        z-index: 1;
      }
      
      .content {
        padding: 50px 40px;
        background: #FFFFFF;
        color: #000000;
      }
      
      .section {
        margin-bottom: 40px;
      }
      
      .section-title {
        font-size: 22px;
        font-weight: 600;
        color: #000000;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
      }
      
      .section-title::before {
        content: '';
        width: 4px;
        height: 24px;
        background: linear-gradient(135deg, #2563EB, #7C3AED);
        border-radius: 2px;
        margin-right: 16px;
      }
      
      .top-match-card {
        background: linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%);
        border: 2px solid #E5E7EB;
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 30px;
        position: relative;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      }
      
      .match-badge {
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        display: inline-block;
        margin-bottom: 16px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      .match-name {
        font-size: 24px;
        font-weight: 700;
        color: #000000;
        margin-bottom: 12px;
      }
      
      .match-description {
        font-size: 16px;
        color: #333333;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      
      .match-score {
        display: inline-flex;
        align-items: center;
        background: linear-gradient(135deg, #2563EB, #7C3AED);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
      }
      
      .score-label {
        margin-right: 8px;
        font-size: 14px;
      }
      
      .score-value {
        font-size: 18px;
        font-weight: 700;
      }
      
      .profile-card {
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 16px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      }
      
      .profile-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #F3F4F6;
      }
      
      .profile-item:last-child {
        border-bottom: none;
      }
      
      .profile-label {
        font-weight: 500;
        color: #6B7280;
        font-size: 15px;
      }
      
      .profile-value {
        font-weight: 600;
        color: #000000;
        font-size: 15px;
      }
      
      .steps-list {
        list-style: none;
        padding: 0;
        background: #FFFFFF;
      }
      
      .steps-list li {
        padding: 16px 0;
        padding-left: 50px;
        position: relative;
        color: #000000;
        font-size: 16px;
        line-height: 1.5;
      }
      
      .steps-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        top: 16px;
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: white;
        padding: 20px 40px;
        text-decoration: none;
        border-radius: 16px;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
        margin: 30px 0;
        transition: all 0.3s ease;
        box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3);
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(37, 99, 235, 0.4);
      }
      
      .cta-container {
        text-align: center;
        padding: 30px;
        background: #FFFFFF;
        border-radius: 16px;
        border: 1px solid #F3F4F6;
        margin-top: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      }
      
      .footer {
        background: #1F2937;
        padding: 40px;
        text-align: center;
        border-top: 1px solid #374151;
      }
      
      .footer-logo {
        font-size: 20px;
        font-weight: 700;
        color: #FFFFFF;
        margin-bottom: 10px;
      }
      
      .footer-tagline {
        color: #D1D5DB;
        font-size: 16px;
        margin-bottom: 20px;
      }
      
      .footer-disclaimer {
        font-size: 14px;
        color: #9CA3AF;
        line-height: 1.5;
        margin-bottom: 16px;
      }
      
      .footer-unsubscribe {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #374151;
      }
      
      .unsubscribe-link {
        color: #9CA3AF;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.3s ease;
      }
      
      .unsubscribe-link:hover {
        text-decoration: underline !important;
        color: #D1D5DB !important;
      }
      
      @media (max-width: 480px) {
        body {
          padding: 10px;
        }
        
        .email-container {
          border-radius: 0;
          margin: 0;
          max-width: 100%;
        }
        
        .header {
          padding: 40px 20px;
        }
        
        .content {
          padding: 40px 20px;
        }
        
        .header h1 {
          font-size: 28px;
        }
        
        .cta-button {
          width: 100%;
          padding: 16px 20px;
        }
        
        .profile-card, .top-match-card {
          padding: 20px;
        }
        
        .footer {
          padding: 30px 20px;
        }
      }
    `;
  }

  private getBaseStyles(): string {
    return this.getBrighterStyles();
  }
}

export const emailService = EmailService.getInstance();
