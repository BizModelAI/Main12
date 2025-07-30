// API Routes constants
export const API_ROUTES = {
  AUTH_ME: '/api/auth/me',
  AUTH_LOGIN: '/api/auth/login', 
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_LATEST_QUIZ_DATA: '/api/auth/latest-quiz-data',
  USER_PRICING: '/api/user-pricing/1',
  GENERATE_PDF: '/api/generate-pdf',
} as const;

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API request function
async function apiRequest(
  url: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response isn't JSON, use status text
    }
    throw new ApiError(errorMessage, response.status, response.statusText);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
}

// HTTP method wrappers
export async function apiGet(url: string): Promise<any> {
  return apiRequest(url, { method: 'GET' });
}

export async function apiPost(url: string, data?: any): Promise<any> {
  return apiRequest(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut(url: string, data?: any): Promise<any> {
  return apiRequest(url, {
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete(url: string): Promise<any> {
  return apiRequest(url, { method: 'DELETE' });
}

// Enhanced API client with timeout and retry logic
export class APIClient {
  private static readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  static async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = APIClient.DEFAULT_TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  static async fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = APIClient.MAX_RETRIES): Promise<Response> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await APIClient.fetchWithTimeout(url, options);
        
        // Don't retry on client errors (4xx), only server errors (5xx)
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response;
        }
        
        // Server error - retry if we have attempts left
        if (attempt < maxRetries) {
          await APIClient.delay(APIClient.RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }
        
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          await APIClient.delay(APIClient.RETRY_DELAY * Math.pow(2, attempt));
          continue;
        }
      }
    }

    throw lastError!;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
