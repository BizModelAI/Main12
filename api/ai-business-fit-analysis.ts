import type { VercelRequest, VercelResponse } from '@vercel/node';
// Note: aiScoringService functionality needs to be moved to _lib or inlined

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { quizData } = req.body;
  if (!quizData) {
    res.status(400).json({ error: 'Quiz data is required' });
    return;
  }
  try {
    // TODO: Move aiScoringService functionality to _lib or implement inline
    const analysis = { message: "Business fit analysis temporarily disabled for deployment" };
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze business fit', details: error instanceof Error ? error.message : String(error) });
  }
}
