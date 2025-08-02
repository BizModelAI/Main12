#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating environment variables for Render deployment...\n');

// Load environment variables
require('dotenv').config();

// Required environment variables for Render deployment
const requiredVars = {
  // Basic configuration
  NODE_ENV: 'production',
  PORT: '3001',
  
  // Database
  DATABASE_URL: 'postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  SUPABASE_URL: 'https://[PROJECT-ID].supabase.co',
  SUPABASE_ANON_KEY: '[ANON-KEY]',
  SUPABASE_SERVICE_ROLE_KEY: '[SERVICE-ROLE-KEY]',
  
  // Security
  SESSION_SECRET: '[32-CHAR-RANDOM-STRING]',
  JWT_SECRET: '[32-CHAR-RANDOM-STRING]',
  ADMIN_SECRET: '[RANDOM-SECRET]',
  
  // Frontend
  FRONTEND_URL: 'https://[APP-NAME].onrender.com',
  
  // APIs
  OPENAI_API_KEY: 'sk-[OPENAI-API-KEY]',
  
  // Payment processing
  STRIPE_PUBLISHABLE_KEY: 'pk_test_[STRIPE-KEY]',
  STRIPE_SECRET_KEY: 'sk_test_[STRIPE-KEY]',
  STRIPE_WEBHOOK_SECRET: 'whsec_[WEBHOOK-SECRET]',
  PAYPAL_CLIENT_ID: '[PAYPAL-CLIENT-ID]',
  PAYPAL_CLIENT_SECRET: '[PAYPAL-CLIENT-SECRET]',
  PAYPAL_MODE: 'sandbox',
  
  // Email
  RESEND_API_KEY: 're_[RESEND-API-KEY]',
  
  // Optional but recommended
  LOG_LEVEL: 'info',
  RATE_LIMIT_WINDOW_MS: '60000',
  RATE_LIMIT_MAX_REQUESTS: '100',
  CORS_ORIGINS: 'https://[APP-NAME].onrender.com,https://bizmodelai.com'
};

// Render-specific variables (auto-set by Render)
const renderVars = {
  RENDER: 'true',
  RENDER_EXTERNAL_URL: 'https://[APP-NAME].onrender.com',
  RENDER_INSTANCE_ID: '[AUTO-SET]'
};

// Check required variables
console.log('📋 Checking required environment variables:');
console.log('=' .repeat(60));

let missingVars = [];
let invalidVars = [];

Object.entries(requiredVars).forEach(([key, expectedFormat]) => {
  const value = process.env[key];
  
  if (!value) {
    missingVars.push(key);
    console.log(`❌ ${key}: MISSING`);
  } else if (value.includes('[YOUR-') || value.includes('[GENERATE-') || value.includes('[RANDOM-')) {
    invalidVars.push(key);
    console.log(`⚠️  ${key}: SET BUT NEEDS ACTUAL VALUE`);
  } else {
    console.log(`✅ ${key}: SET`);
  }
});

// Check Render-specific variables
console.log('\n🔧 Checking Render-specific variables:');
console.log('=' .repeat(60));

Object.entries(renderVars).forEach(([key, expectedFormat]) => {
  const value = process.env[key];
  
  if (!value) {
    console.log(`ℹ️  ${key}: NOT SET (will be auto-set by Render)`);
  } else {
    console.log(`✅ ${key}: SET`);
  }
});

// Summary
console.log('\n📊 SUMMARY:');
console.log('=' .repeat(60));

if (missingVars.length === 0 && invalidVars.length === 0) {
  console.log('🎉 All environment variables are properly configured!');
  console.log('✅ Your application is ready for Render deployment.');
} else {
  if (missingVars.length > 0) {
    console.log(`❌ Missing variables (${missingVars.length}):`);
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
  }
  
  if (invalidVars.length > 0) {
    console.log(`⚠️  Variables needing actual values (${invalidVars.length}):`);
    invalidVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
  }
  
  console.log('\n🔧 To fix these issues:');
  console.log('1. Go to your Render dashboard');
  console.log('2. Navigate to your web service');
  console.log('3. Go to the "Environment" tab');
  console.log('4. Add the missing variables with actual values');
  console.log('5. Replace placeholder values with real API keys and secrets');
}

// Additional checks
console.log('\n🔍 Additional validation checks:');
console.log('=' .repeat(60));

// Check if DATABASE_URL uses pooler
const dbUrl = process.env.DATABASE_URL;
if (dbUrl && !dbUrl.includes('pooler')) {
  console.log('⚠️  DATABASE_URL: Should use pooler endpoint for better performance');
  console.log('   Recommended: aws-0-us-east-1.pooler.supabase.com:6543');
}

// Check if CORS_ORIGINS includes Render URL
const corsOrigins = process.env.CORS_ORIGINS;
if (corsOrigins && !corsOrigins.includes('onrender.com')) {
  console.log('⚠️  CORS_ORIGINS: Should include your Render app URL');
  console.log('   Add: https://[YOUR-APP-NAME].onrender.com');
}

// Check if using test keys for payments
const stripeKey = process.env.STRIPE_SECRET_KEY;
const paypalMode = process.env.PAYPAL_MODE;

if (stripeKey && !stripeKey.includes('sk_test_')) {
  console.log('⚠️  STRIPE_SECRET_KEY: Using production key - make sure this is intentional');
}

if (paypalMode && paypalMode !== 'sandbox') {
  console.log('⚠️  PAYPAL_MODE: Using production mode - make sure this is intentional');
}

// Generate secrets if needed
console.log('\n🔐 Secret generation commands:');
console.log('=' .repeat(60));

if (missingVars.includes('SESSION_SECRET') || missingVars.includes('JWT_SECRET')) {
  console.log('Generate SESSION_SECRET and JWT_SECRET:');
  console.log('openssl rand -base64 32');
}

if (missingVars.includes('ADMIN_SECRET')) {
  console.log('Generate ADMIN_SECRET:');
  console.log('openssl rand -hex 16');
}

console.log('\n📚 For detailed setup instructions, see: RENDER_ENV_SETUP.md');
console.log('🚀 Once all variables are set, your app will be ready for deployment!'); 