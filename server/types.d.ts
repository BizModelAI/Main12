// Type declarations for modules that TypeScript can't find

declare module "express" {
  import express from "express";
  export = express;
  export as namespace express;
  
  // Export types properly
  export interface Request {
    user?: {
      id: number;
      email: string;
      userType: string;
    };
    session: {
      userId?: number;
      userType?: string;
      quizAttemptId?: string;
    } & Express.Session;
    path: string;
    body: any;
    query: any;
  }
  
  export interface Response {
    status(code: number): Response;
    json(data: any): Response;
    sendFile(path: string): Response;
    headersSent: boolean;
  }
  
  export interface NextFunction {
    (err?: any): void;
  }
  
  export interface Express {
    use(middleware: any): Express;
    use(path: string, middleware: any): Express;
    all(path: string, handler: (req: Request, res: Response) => void): Express;
    get(path: string, handler: (req: Request, res: Response) => void): Express;
    listen(port: number, callback?: () => void): any;
    json(options?: any): any;
    urlencoded(options?: any): any;
    static(path: string): any;
  }
}

declare module "bcrypt" {
  export function hash(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): Promise<string>;
  export function compare(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
  export function hashSync(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): string;
  export function compareSync(
    data: string | Buffer,
    encrypted: string,
  ): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
}

declare module "express-session" {
  import session from "express-session";
  export = session;
  export as namespace session;

  interface SessionData {
    userId?: number;
    testValue?: string;
    userType?: string;
    quizAttemptId?: string;
  }
  
  class MemoryStore {
    constructor(options?: any);
  }
  
  export { MemoryStore };
}

declare module "memorystore" {
  function MemoryStore(session: any): any;
  export = MemoryStore;
}

// Global type definitions for the application
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL: string;
      SESSION_SECRET: string;
      FRONTEND_URL?: string;
      OPENAI_API_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      RESEND_API_KEY: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      PAYPAL_CLIENT_ID: string;
      PAYPAL_CLIENT_SECRET: string;
      PAYPAL_MODE: 'sandbox' | 'live';
    }
  }
}

// Express request augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      userType: string;
    };
    session: {
      userId?: number;
      userType?: string;
      quizAttemptId?: string;
    } & Express.Session;
  }
}

// Common types used throughout the application
export interface QuizData {
  id: string;
  responses: Record<string, any>;
  completedAt: Date;
  userEmail?: string;
  userType: string;
}

export interface BusinessModel {
  id: string;
  name: string;
  emoji: string;
  description: string;
  fitScore: number;
  characteristics: string[];
  pros: string[];
  cons: string[];
  requirements: string[];
  estimatedStartupCost: number;
  estimatedMonthlyRevenue: number;
  timeToProfit: string;
  difficulty: string;
  category: string;
}

export interface AIAnalysis {
  personalizedPaths: BusinessModel[];
  aiInsights: {
    keyInsights: string[];
    recommendations: string[];
    riskFactors: string[];
  };
  allCharacteristics: string[];
  businessFitDescriptions: Record<string, string>;
  businessAvoidDescriptions: Record<string, string>;
}

export interface User {
  id: number;
  email: string;
  userType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId?: number;
  userEmail?: string;
  userType: string;
  quizData: QuizData;
  aiAnalysis?: AIAnalysis;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentData {
  id: string;
  userId: number;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
