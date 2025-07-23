// Centralized API client for all backend calls with type safety

/**
 * API endpoint constants
 * NOTE: All routes must match backend implementation in server/routes.ts and server/auth.ts
 */
export const API_ROUTES = {
  // Auth routes
  AUTH_ME: "/api/auth/me",
  AUTH_LOGIN: "/api/auth/login",
  AUTH_SIGNUP: "/api/auth/signup",
  AUTH_LATEST_QUIZ_DATA: "/api/auth/latest-quiz-data",
  // Deprecated/removed: AUTH_LOGOUT, AUTH_PROFILE, AUTH_ACCOUNT, AUTH_FORGOT_PASSWORD, AUTH_RESET_PASSWORD, AUTH_CHANGE_PASSWORD, AUTH_UNSUBSCRIBE, AUTH_VERIFY_RESET_TOKEN, AUTH_SAVE_QUIZ_DATA
  // Quiz and data routes
  // Deprecated/removed: SAVE_QUIZ_DATA, CHECK_EXISTING_ATTEMPTS
  QUIZ_ATTEMPTS: "/api/quiz-attempts",
  QUIZ_ATTEMPT: "/api/quiz-attempts", // Use /api/quiz-attempts/[id] for specific attempt
  // AI and analysis routes
  OPENAI_CHAT: "/api/openai-chat",
  OPENAI_STATUS: "/api/openai-status",
  AI_BUSINESS_FIT_ANALYSIS: "/api/ai-business-fit-analysis",
  GENERATE_INCOME_PROJECTIONS: "/api/generate-income-projections",
  GENERATE_BUSINESS_FIT_DESCRIPTIONS: "/api/generate-business-fit-descriptions",
  // Deprecated/removed: AI_PERSONALITY_ANALYSIS, AI_INSIGHTS, ANALYZE_SKILLS, GENERATE_FULL_REPORT
  // Payment routes
  STRIPE_CONFIG: "/api/stripe-config",
  STRIPE_WEBHOOK: "/api/stripe/webhook",
  USER_PRICING: "/api/user-pricing",
  // Deprecated/removed: CREATE_REPORT_UNLOCK_PAYMENT, CAPTURE_PAYPAL_PAYMENT, PAYPAL_CONFIG
  // Deprecated/removed: BUSINESS_RESOURCES, GENERATE_PDF, SEND_QUIZ_RESULTS, SEND_WELCOME_EMAIL
};

export type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES];

/**
 * Generic API response type
 */
export type ApiResponse<T = any> = Promise<T>;

/**
 * Enhanced error handling for API requests
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base request configuration
 */
// NOTE: This project now uses JWT cookie authentication for all protected endpoints.
// Ensure all requests to protected endpoints use credentials: 'include'.
const baseRequestConfig: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Enhanced error handler
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // If JSON parsing fails, use status text
      errorData = { error: response.statusText };
    }
    
    throw new ApiError(
      errorData.error || `Request failed: ${response.status}`,
      response.status,
      errorData
    );
  }
  
  return response.json();
}

/**
 * POST request with type safety and enhanced error handling
 */
export async function apiPost<T = any, B = any>(
  url: ApiRoute, 
  data: B, 
  options: RequestInit = {}
): ApiResponse<T> {
  const response = await fetch(url, {
    ...baseRequestConfig,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
  
  return handleResponse<T>(response);
}

/**
 * GET request with type safety and enhanced error handling
 */
export async function apiGet<T = any>(
  url: ApiRoute, 
  options: RequestInit = {}
): ApiResponse<T> {
  const response = await fetch(url, {
    ...baseRequestConfig,
    method: 'GET',
    ...options,
  });
  
  return handleResponse<T>(response);
}

/**
 * PUT request with type safety and enhanced error handling
 */
export async function apiPut<T = any, B = any>(
  url: ApiRoute, 
  data: B, 
  options: RequestInit = {}
): ApiResponse<T> {
  const response = await fetch(url, {
    ...baseRequestConfig,
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
  
  return handleResponse<T>(response);
}

/**
 * DELETE request with type safety and enhanced error handling
 */
export async function apiDelete<T = any>(
  url: ApiRoute, 
  options: RequestInit = {}
): ApiResponse<T> {
  const response = await fetch(url, {
    ...baseRequestConfig,
    method: 'DELETE',
    ...options,
  });
  
  return handleResponse<T>(response);
}

/**
 * PATCH request with type safety and enhanced error handling
 */
export async function apiPatch<T = any, B = any>(
  url: ApiRoute, 
  data: B, 
  options: RequestInit = {}
): ApiResponse<T> {
  const response = await fetch(url, {
    ...baseRequestConfig,
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  });
  
  return handleResponse<T>(response);
}

// Export the error class for use in components
export { ApiError };
