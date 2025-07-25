#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'api/admin/refunds.ts',
  'api/admin/payments.ts', 
  'api/admin/convert-temp-user.ts',
  'api/clear-business-model-ai-content.ts',
  'api/auth/latest-quiz-data.ts',
  'api/quiz-attempts/attempt/[quizAttemptId]/email.ts',
  'api/quiz-attempts/attempt/[quizAttemptId]/ai-content.ts',
  'api/quiz-attempts/attempt/[quizAttemptId]/ai-content/index.ts',
  'api/quiz-attempts/attempt/[quizAttemptId]/index.ts',
  'api/quiz-attempts/user/[userId].ts'
];

filesToFix.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const fixed = content
      .replace(/'api\/_lib\//g, "'../_lib/")
      .replace(/"api\/_lib\//g, '"../_lib/')
      .replace(/from 'api\/_lib\//g, "from '../_lib/")
      .replace(/from "api\/_lib\//g, 'from "../_lib/');
    
    if (content !== fixed) {
      fs.writeFileSync(file, fixed);
      console.log(`Fixed: ${file}`);
    }
  } catch (err) {
    console.log(`Could not fix ${file}: ${err.message}`);
  }
});

console.log('Import fix completed');
