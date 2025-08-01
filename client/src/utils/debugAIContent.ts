// Debugging utilities for AI content system
import { API_CONFIG } from "./apiConfig";

export const debugAIContent = {
  // Test AI content endpoints
  async testEndpoints(quizAttemptId: number = 4) {
    console.log(" Testing AI Content Endpoints...");

    try {
      // Test getting AI content
      console.log("1. Testing GET endpoint...");
      const getResponse = await fetch(
        `${API_CONFIG.BASE_URL}/api/quiz-attempts/attempt/${quizAttemptId}/ai-content`,
        {
          credentials: "include",
        },
      );
      console.log("GET Response status:", getResponse.status);

      if (getResponse.ok) {
        const getData = await getResponse.json();
        console.log("✅ GET successful:", getData);
      } else {
        console.log("❌ GET failed:", await getResponse.text());
      }

      // Test saving AI content
      console.log("2. Testing POST endpoint...");
      const testData = {
        insights: "Test insights from debugger",
        timestamp: new Date().toISOString(),
        testMode: true,
      };

      const postResponse = await fetch(
        `${API_CONFIG.BASE_URL}/api/quiz-attempts/attempt/${quizAttemptId}/ai-content`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aiContent: testData }),
        },
      );

      console.log("POST Response status:", postResponse.status);

      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log("✅ POST successful:", postData);

        // Verify by getting again
        console.log("3. Verifying saved data...");
        const verifyResponse = await fetch(
          `${API_CONFIG.BASE_URL}/api/quiz-attempts/attempt/${quizAttemptId}/ai-content`,
          {
            credentials: "include",
          },
        );
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log("✅ Verification successful:", verifyData);
        }
      } else {
        console.log("❌ POST failed:", await postResponse.text());
      }
    } catch (error) {
      console.error(" Test failed:", error);
    }
  },

  // Test quiz attempt switching
  async testQuizSwitching() {
    console.log(" Testing Quiz Attempt Switching...");

    // Get quiz attempts
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/quiz-attempts/user/5`, {
        credentials: "include",
      });
      if (response.ok) {
        const attempts = await response.json();
        console.log(" Available attempts:", attempts.length);

        attempts.forEach((attempt: any, index: number) => {
          console.log(
            `  ${index + 1}. Attempt ${attempt.id} - ${new Date(attempt.completedAt).toLocaleDateString()}`,
          );
        });

        return attempts;
      } else {
        console.log("❌ Failed to get quiz attempts:", response.status);
      }
    } catch (error) {
      console.error(" Quiz switching test failed:", error);
    }
  },

  // Simulate clicking on a quiz attempt
  async simulateQuizAttemptClick(attemptId: number) {
    console.log(` Simulating click on attempt ${attemptId}...`);

    try {
      // Get AI content for this attempt
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/quiz-attempts/attempt/${attemptId}/ai-content`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Successfully loaded AI content for attempt:", data);
        return data;
      } else {
        console.log("❌ Failed to load AI content:", response.status);
        const errorText = await response.text();
        console.log("Error details:", errorText);
      }
    } catch (error) {
      console.error(" Quiz attempt click simulation failed:", error);
    }
  },

  // Check localStorage for AI content
  checkLocalStorage() {
    console.log(" Checking localStorage for AI content...");

    const aiContentKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ai-content-')) {
        aiContentKeys.push(key);
      }
    }

    console.log(" Found AI content keys:", aiContentKeys);

    aiContentKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          console.log(`  ${key}:`, parsed);
        }
      } catch (error) {
        console.error(` Error parsing ${key}:`, error);
      }
    });
  }
};

// Make it available globally for browser console testing
(window as any).debugAIContent = debugAIContent;

export default debugAIContent;
