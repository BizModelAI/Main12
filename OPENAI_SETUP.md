# 🤖 OpenAI Integration Setup

## Current Issue: Fallback Content Instead of AI Insights

Your quiz application is currently showing fallback content instead of AI-generated insights because the OpenAI API key is not configured.

## Quick Fix: Set Up OpenAI API Key

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up/Login to your OpenAI account
3. Add billing information (required for API usage)
4. Click "Create new secret key"
5. Name it "Business Quiz App" 
6. Copy the generated key (starts with `sk-...`)

### 2. Configure Environment Variable

**For Vercel Production:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-your-actual-api-key-here`
   - **Environment**: Production, Preview, Development
5. Click **Save**
6. **Redeploy** your project

**For Local Development:**
```bash
# Add to your .env file
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Verify Setup
After setting the API key:
1. Take a new quiz
2. Check browser console for these logs:
   - `🔑 Checking OpenAI API key: Present`
   - `✅ Successfully parsed OpenAI API response`
   - `✅ Returning AI-generated content (not fallback)`

## Cost Information
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **Average quiz insight**: ~1200 tokens (~$0.0024 per quiz)
- **Estimated monthly cost**: $5-20 for typical usage

## Alternative: Free Fallback Content
If you prefer not to use OpenAI (to avoid costs), the application will continue to work with static fallback content. However, users won't get personalized AI insights.

## Testing Your Setup
Visit: `/api/test-openai-key` to check if your key is properly configured.

## Troubleshooting

**Still seeing fallback content?**
1. Check browser console for error messages
2. Verify API key starts with `sk-`
3. Ensure you have billing set up in OpenAI
4. Try regenerating the API key if it's not working

**API errors?**
- Check your OpenAI account billing status
- Verify the API key hasn't exceeded rate limits
- Make sure the key has chat completions permissions
