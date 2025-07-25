// Environment variable validation for production
export function validateRequiredEnvVars() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'OPENAI_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function validateOptionalEnvVars() {
  const warnings: string[] = [];
  
  if (!process.env.STRIPE_SECRET_KEY) {
    warnings.push('STRIPE_SECRET_KEY not set - payment features will be disabled');
  }
  
  if (!process.env.FRONTEND_URL) {
    warnings.push('FRONTEND_URL not set - using fallback CORS configuration');
  }
  
  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('Environment warnings:', warnings.join(', '));
  }
}

// Auto-validate on import in production - but catch errors to prevent crash
if (process.env.NODE_ENV === 'production') {
  try {
    validateRequiredEnvVars();
    validateOptionalEnvVars();
  } catch (error) {
    console.error('Environment validation failed:', error);
    // Don't throw - let individual functions handle validation
  }
}
