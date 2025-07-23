import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key not configured' });
    return;
  }
  const { quizData, businessMatches } = req.body;
  if (!quizData || !businessMatches || !Array.isArray(businessMatches)) {
    res.status(400).json({ error: 'Missing or invalid quiz data or business matches' });
    return;
  }
  const descriptions = [];
  for (let i = 0; i < businessMatches.length; i++) {
    const match = businessMatches[i];
    const rank = i + 1;
    const prompt = `Based on your quiz responses, generate a detailed "Why This Fits You" description for your ${rank === 1 ? "top" : rank === 2 ? "second" : "third"} business match.\n\nYour Quiz Data:\n- Main Motivation: ${quizData.mainMotivation}\n- Weekly Time Commitment: ${quizData.weeklyTimeCommitment}\n- Income Goal: ${quizData.successIncomeGoal}\n- Tech Skills Rating: ${quizData.techSkillsRating}\n- Risk Comfort Level: ${quizData.riskComfortLevel}\n- Self-Motivation Level: ${quizData.selfMotivationLevel}\n- Direct Communication Enjoyment: ${quizData.directCommunicationEnjoyment}\n- Creative Work Enjoyment: ${quizData.creativeWorkEnjoyment}\n- Work Structure Preference: ${quizData.workStructurePreference}\n- Learning Preference: ${quizData.learningPreference}\n- First Income Timeline: ${quizData.firstIncomeTimeline}\n- Upfront Investment: ${quizData.upfrontInvestment}\n- Brand Face Comfort: ${quizData.brandFaceComfort}\n- Long-term Consistency: ${quizData.longTermConsistency}\n- Trial & Error Comfort: ${quizData.trialErrorComfort}\n- Organization Level: ${quizData.organizationLevel}\n- Uncertainty Handling: ${quizData.uncertaintyHandling}\n- Work Collaboration Preference: ${quizData.workCollaborationPreference}\n- Decision Making Style: ${quizData.decisionMakingStyle}\n\nBusiness Match:\n- Name: ${match.name}\n- Fit Score: ${match.fitScore}%\n- Description: ${match.description}\n- Time to Profit: ${match.timeToProfit}\n- Startup Cost: ${match.startupCost}\n- Potential Income: ${match.potentialIncome}\n\nGenerate a detailed personalized analysis of at least 6 sentences explaining why this business model specifically fits you. Write it as a cohesive paragraph, not bullet points. Be extremely specific about:\n1. How your exact personality traits, goals, and preferences align with this business model\n2. What specific aspects of your quiz responses make you well-suited for this path\n3. How your skills, time availability, and risk tolerance perfectly match the requirements\n4. What unique advantages you bring to this business model based on your specific answers\n5. How your learning style and work preferences complement this business approach\n6. Why this particular combination of traits makes you likely to succeed in this field\n\nReference specific quiz data points and explain the connections. Make it personal and specific to your responses, not generic advice. Write in a supportive, consultative tone that demonstrates deep understanding of your profile.\n\nCRITICAL: Use ONLY the actual data provided above. Do NOT make up specific numbers, amounts, or timeframes. Reference the exact ranges and values shown in your profile. If you selected a range, always refer to the full range, never specific numbers within it. Always address the user directly using 'you' and 'your'.`;
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert business consultant specializing in entrepreneurial personality matching. Generate personalized, specific explanations for why certain business models fit individual users based on their quiz responses.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      descriptions.push({ businessId: match.id, description: content });
    } catch (error) {
      descriptions.push({ businessId: match.id, description: `This business model aligns well with your profile.` });
    }
  }
  res.status(200).json({ descriptions });
} 