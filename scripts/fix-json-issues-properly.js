import fs from 'fs';

// Function to fix JSON issues properly
function fixJSONIssuesProperly(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove all the problematic circular reference code that was added
  content = content
    // Remove the seen Set declarations
    .replace(/const seen = new Set\(\);/g, '')
    .replace(/let seen = new Set\(\);/g, '')
    
    // Remove the problematic JSON.stringify modifications
    .replace(/JSON\.stringify\(([^)]+)\) \|\| null, \(key, value\) => \{[\s\S]*?seen\.add\(value\);\s*\}\s*return value;\s*\}, 2\)/g, 'JSON.stringify($1)')
    
    // Remove the problematic JSON.parse modifications
    .replace(/\(\(\) => \{[\s\S]*?try \{[\s\S]*?return JSON\.parse\(([^)]+)\);[\s\S]*?catch \(error\) \{[\s\S]*?console\.error\('JSON parse error:', error\);[\s\S]*?return null;[\s\S]*?\}\)\(\)/g, 'JSON.parse($1)')
    
    // Fix specific localStorage + JSON.parse patterns
    .replace(/const (\w+) = localStorage\.getItem\(([^)]+)\);[\s\S]*?if \(\1\) \{[\s\S]*?try \{[\s\S]*?(\w+) = JSON\.parse\(\1\);[\s\S]*?catch \(error\) \{[\s\S]*?console\.error\('Error parsing [^']+:', error\);[\s\S]*?localStorage\.removeItem\(\2\);[\s\S]*?\}[\s\S]*?\}/g, 
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

  // Add proper error handling for specific JSON.parse calls that need it
  if (filePath.includes('Dashboard.tsx')) {
    content = content.replace(
      /if \(savedModel\) \{[\s\S]*?setSelectedBusinessModel\(JSON\.parse\(savedModel\)\);/g,
      `if (savedModel) {
        try {
          setSelectedBusinessModel(JSON.parse(savedModel));
        } catch (error) {
          console.error('Error parsing saved business model:', error);
          localStorage.removeItem('selectedBusinessModel');
        }
      }`
    );
  }

  if (filePath.includes('BusinessModelScoresContext.tsx')) {
    content = content.replace(
      /const scoresData: BusinessModelScoresData = JSON\.parse\(storedScores\);/g,
      `const scoresData: BusinessModelScoresData = (() => {
        try {
          return JSON.parse(storedScores);
        } catch (error) {
          console.error('Error parsing stored scores:', error);
          return null;
        }
      })();`
    );
  }

  if (filePath.includes('contentUtils.ts')) {
    content = content.replace(
      /const parsed = JSON\.parse\(value\);/g,
      `const parsed = (() => {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.error('Error parsing value:', error);
          return null;
        }
      })();`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

// Files to fix
const filesToFix = [
  'client/src/pages/Dashboard.tsx',
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
  'client/src/utils/testEmojiSafeguards.ts'
];

console.log('🔧 Fixing JSON issues properly...\n');

filesToFix.forEach(fixJSONIssuesProperly);

console.log('\n🎉 All JSON issues fixed properly!');
console.log('Run "npx tsc --noEmit" to verify TypeScript compilation.'); 