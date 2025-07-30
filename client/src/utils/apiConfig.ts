// Centralized API configuration
export const API_CONFIG = {
  // Base URL for API calls - use relative URLs in development to go through Vite proxy
  // In production, use the same domain since frontend and backend are served from the same server
  BASE_URL: process.env.NODE_ENV === 'development' ? "" : "",
  
  // Helper function to get full URL
  getFullUrl: (path: string): string => {
    if (path.startsWith('http')) {
      return path;
    }
    return `${API_CONFIG.BASE_URL}${path}`;
  },
  
  // Common API endpoints
  ENDPOINTS: {
    AUTH: {
      ME: '/api/auth/me',
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      LOGOUT: '/api/auth/logout',
      LATEST_QUIZ_DATA: '/api/auth/latest-quiz-data',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      VERIFY_RESET_TOKEN: '/api/auth/verify-reset-token',
      CHANGE_PASSWORD: '/api/auth/change-password',
      ACCOUNT: '/api/auth/account',
      SAVE_QUIZ_DATA: '/api/auth/save-quiz-data',
      UNSUBSCRIBE: '/api/auth/unsubscribe',
    },
    QUIZ: {
      RECORD: '/api/quiz-attempts/record',
      RECORD_GUEST: '/api/quiz-attempts/record-guest',
      BY_ID: '/api/quiz-attempts/by-id',
      ATTEMPT: '/api/quiz-attempts/attempt',
      USER: '/api/quiz-attempts/user',
    },
    AI: {
      OPENAI_CHAT: '/api/openai-chat',
      OPENAI_STATUS: '/api/openai-status',
      BUSINESS_FIT_ANALYSIS: '/api/ai-business-fit-analysis',
      GENERATE_INCOME_PROJECTIONS: '/api/generate-income-projections',
      GENERATE_BUSINESS_FIT_DESCRIPTIONS: '/api/generate-business-fit-descriptions',
      CLEAR_BUSINESS_MODEL_AI_CONTENT: '/api/clear-business-model-ai-content',
    },
    ADMIN: {
      PAYMENTS: '/api/admin/payments',
      REFUNDS: '/api/admin/refunds',
      REFUND: '/api/admin/refund',
    },
    PAYMENT: {
      CAPTURE_PAYPAL: '/api/capture-paypal-payment',
      CREATE_REPORT_UNLOCK: '/api/create-report-unlock-payment',
      PAYMENT_STATUS: '/api/payment-status',
      USER_PRICING: '/api/user-pricing',
    },
    OTHER: {
      GENERATE_PDF: '/api/generate-pdf',
      CONTACT: '/api/contact',
      CHECK_EXISTING_ATTEMPTS: '/api/check-existing-attempts',
      SEND_QUIZ_RESULTS: '/api/send-quiz-results',
      EMAIL_LINK: '/api/email-link',
      BUSINESS_RESOURCES: '/api/business-resources',
      AI_INSIGHTS: '/api/ai-insights',
      ANALYZE_SKILLS: '/api/analyze-skills',
    }
  }
};

// Enhanced fetch function with proper base URL
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const fullUrl = API_CONFIG.getFullUrl(path);
  
  return fetch(fullUrl, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
}

// Enhanced fetch with JSON response
export async function apiFetchJson(path: string, options: RequestInit = {}): Promise<any> {
  const response = await apiFetch(path, options);
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response isn't JSON, use status text
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
} 