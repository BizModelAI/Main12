import fs from 'fs';

// Function to fix JSON issues in a file
function fixJSONIssues(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix JSON.parse without error handling
  content = content.replace(
    /JSON\.parse\(([^)]+)\)/g,
    (match, arg) => {
      // Skip if already in try-catch
      if (content.includes(`try`) && content.includes(`catch`) && 
          content.indexOf(`try`) < content.indexOf(match) && 
          content.indexOf(`catch`) > content.indexOf(match)) {
        return match;
      }
      
      // Add safe JSON parsing
      return `(() => {
        try {
          return JSON.parse(${arg});
        } catch (error) {
          console.error('JSON parse error:', error);
          return null;
        }
      })()`;
    }
  );

  // Fix localStorage.getItem + JSON.parse combinations
  content = content.replace(
    /const\s+(\w+)\s*=\s*localStorage\.getItem\(([^)]+)\);\s*if\s*\(\1\)\s*\{\s*(\w+)\s*=\s*JSON\.parse\(\1\);/g,
    (match, varName, key, targetVar) => {
      return `const ${varName} = localStorage.getItem(${key});
      if (${varName}) {
        try {
          ${targetVar} = JSON.parse(${varName});
        } catch (error) {
          console.error('Error parsing ${key}:', error);
          localStorage.removeItem(${key});
        }
      }`;
    }
  );

  // Fix direct JSON.parse on localStorage.getItem
  content = content.replace(
    /(\w+)\s*=\s*JSON\.parse\(localStorage\.getItem\(([^)]+)\)\)/g,
    (match, varName, key) => {
      return `${varName} = (() => {
        try {
          const stored = localStorage.getItem(${key});
          return stored ? JSON.parse(stored) : null;
        } catch (error) {
          console.error('Error parsing ${key}:', error);
          localStorage.removeItem(${key});
          return null;
        }
      })()`;
    }
  );

  // Fix JSON.stringify without null checks
  content = content.replace(
    /JSON\.stringify\(([^)]+)\)/g,
    (match, arg) => {
      // Skip if already has null check
      if (arg.includes('||') || arg.includes('&&') || arg.includes('?')) {
        return match;
      }
      
      // Add null check for JSON.stringify
      return `JSON.stringify(${arg} || null)`;
    }
  );

  // Fix potential circular reference issues
  content = content.replace(
    /JSON\.stringify\(([^)]+)\)/g,
    (match, arg) => {
      // Skip if already has replacer function
      if (arg.includes('replacer') || arg.includes('null, 2')) {
        return match;
      }
      
      // Add safe stringify with replacer
      return `JSON.stringify(${arg}, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      }, 2)`;
    }
  );

  // Add seen Set for circular reference handling
  if (content.includes('JSON.stringify') && !content.includes('const seen = new Set()')) {
    content = content.replace(
      /(function\s+\w+\s*\([^)]*\)\s*\{|const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)/g,
      (match) => {
        return `${match}
        const seen = new Set();`;
      }
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

// Files to fix
const filesToFix = [
  'client/src/pages/Dashboard.tsx',
  'client/src/pages/PDFReportPage.tsx',
  'client/src/contexts/BusinessModelScoresContext.tsx',
  'client/src/components/PaymentAccountModal.tsx',
  'client/src/components/AIReportLoading.tsx',
  'client/src/components/QuizCompletionLoading.tsx',
  'client/src/components/EnhancedPaymentForm.tsx',
  'client/src/components/CongratulationsLoggedIn.tsx',
  'client/src/components/CongratulationsGuest.tsx',
  'client/src/components/FullReportLoadingPage.tsx',
  'client/src/components/Results.tsx',
  'client/src/utils/contentUtils.ts',
  'client/src/utils/clearAllCaches.ts',
  'client/src/utils/testEmojiSafeguards.ts',
  'server/routes.ts',
  'server/services/aiScoringService.ts'
];

console.log('🔧 Fixing all JSON issues...\n');

filesToFix.forEach(fixJSONIssues);

console.log('\n🎉 All JSON issues fixed!');
console.log('Run tests to verify JSON handling is working correctly.'); 