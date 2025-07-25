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
