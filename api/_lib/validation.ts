// Comprehensive input validation utilities
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validators = {
  // Email validation with domain checking
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    // Check for common typos in domain
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? domain.length >= 4 : false;
  },

  // Password strength validation
  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/(?=.*[a-z])/.test(password)) errors.push('Password must contain lowercase letter');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('Password must contain uppercase letter'); 
    if (!/(?=.*\d)/.test(password)) errors.push('Password must contain number');
    if (!/(?=.*[!@#$%^&*])/.test(password)) errors.push('Password should contain special character');
    
    return { valid: errors.length === 0, errors };
  },

  // Quiz data validation
  quizData: (data: any): boolean => {
    if (!data || typeof data !== 'object') return false;
    if (!data.answers || !Array.isArray(data.answers)) return false;
    if (data.answers.length === 0) return false;
    
    // Validate each answer
    return data.answers.every((answer: any) => 
      answer && 
      typeof answer.questionId === 'number' && 
      answer.value !== undefined &&
      answer.value !== null
    );
  },

  // Payment amount validation
  paymentAmount: (amount: number): boolean => {
    return Number.isFinite(amount) && amount > 0 && amount <= 10000; // Max $100
  },

  // User ID validation
  userId: (id: any): boolean => {
    return Number.isInteger(Number(id)) && Number(id) > 0;
  },

  // String length validation
  stringLength: (str: string, min: number, max: number): boolean => {
    return typeof str === 'string' && str.length >= min && str.length <= max;
  },

  // Sanitize user input
  sanitizeString: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .substring(0, 1000); // Limit length
  },

  // Rate limiting validation
  validateRequestRate: (userRequests: Map<string, number[]>, userKey: string, windowMs: number = 60000, maxRequests: number = 10): boolean => {
    const now = Date.now();
    const userRequestTimes = userRequests.get(userKey) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequestTimes.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    userRequests.set(userKey, recentRequests);
    return true;
  }
};

export function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field]) {
      throw new ValidationError(`${field} is required`, field);
    }
  }
}

export function validateTypes(data: any, fieldTypes: Record<string, string>): void {
  for (const [field, expectedType] of Object.entries(fieldTypes)) {
    if (data[field] !== undefined && typeof data[field] !== expectedType) {
      throw new ValidationError(`${field} must be of type ${expectedType}`, field);
    }
  }
}
