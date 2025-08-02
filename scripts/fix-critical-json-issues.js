import fs from 'fs';

// Function to fix critical JSON issues
function fixCriticalJSONIssues(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix specific critical JSON.parse issues that need error handling
  
  // Fix Dashboard.tsx - JSON.parse(savedModel) without error handling
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

  // Fix BusinessModelScoresContext.tsx - JSON.parse(storedScores) without error handling
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

  // Fix contentUtils.ts - JSON.parse(value) without error handling
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

  // Fix PaymentAccountModal.tsx - JSON.parse(quizData) without error handling
  if (filePath.includes('PaymentAccountModal.tsx')) {
    content = content.replace(
      /const parsedQuizData = quizData \? JSON\.parse\(quizData\) : \{\};/g,
      `const parsedQuizData = quizData ? (() => {
        try {
          return JSON.parse(quizData);
        } catch (error) {
          console.error('Error parsing quiz data:', error);
          return {};
        }
      })() : {};`
    );
  }

  // Fix Results.tsx - JSON.parse(storedInsights) without error handling
  if (filePath.includes('Results.tsx')) {
    content = content.replace(
      /const parsed = JSON\.parse\(storedInsights\);/g,
      `const parsed = (() => {
        try {
          return JSON.parse(storedInsights);
        } catch (error) {
          console.error('Error parsing stored insights:', error);
          return null;
        }
      })();`
    );
  }

  // Fix FullReportLoadingPage.tsx - JSON.parse(storedInsights) without error handling
  if (filePath.includes('FullReportLoadingPage.tsx')) {
    content = content.replace(
      /const parsed = JSON\.parse\(storedInsights\);/g,
      `const parsed = (() => {
        try {
          return JSON.parse(storedInsights);
        } catch (error) {
          console.error('Error parsing stored insights:', error);
          return null;
        }
      })();`
    );
  }

  // Fix testEmojiSafeguards.ts - JSON.parse(cleanedData) without error handling
  if (filePath.includes('testEmojiSafeguards.ts')) {
    content = content.replace(
      /const parsed = JSON\.parse\(cleanedData\);/g,
      `const parsed = (() => {
        try {
          return JSON.parse(cleanedData);
        } catch (error) {
          console.error('Error parsing cleaned data:', error);
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
  'client/src/utils/contentUtils.ts',
  'client/src/components/PaymentAccountModal.tsx',
  'client/src/components/Results.tsx',
  'client/src/components/FullReportLoadingPage.tsx',
  'client/src/utils/testEmojiSafeguards.ts'
];

console.log('🔧 Fixing critical JSON issues...\n');

filesToFix.forEach(fixCriticalJSONIssues);

console.log('\n🎉 Critical JSON issues fixed!');
console.log('Run "npx tsc --noEmit" to verify TypeScript compilation.'); 