# BizModelAI

A comprehensive AI-powered platform for business model discovery and entrepreneurial assessment.

## 🚀 Deploy to Vercel

This project is configured for easy deployment to Vercel. Follow these steps:

### 1. Push to Git Repository

First, push all your code to a Git repository (GitHub, GitLab, or Bitbucket):

```bash
git add .
git commit -m "Initial commit - BizModelAI complete application"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect this is a Node.js project
5. Click "Deploy"

### 3. Set Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

**Required:**

- `DATABASE_URL` - Your Supabase database connection string
- `SESSION_SECRET` - A random secret for session management

**Optional (for full functionality):**

- `OPENAI_API_KEY` - For AI-powered insights
- `RESEND_API_KEY` - For email functionality
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_PUBLISHABLE_KEY` - For Stripe frontend
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhook verification
- `PAYPAL_CLIENT_ID` - For PayPal payment processing
- `PAYPAL_CLIENT_SECRET` - For PayPal payment processing
- `VITE_STRIPE_PUBLISHABLE_KEY` - Client-side Stripe key
- `VITE_PAYPAL_CLIENT_ID` - Client-side PayPal key

### 4. Database Setup

The app uses PostgreSQL. You can use:

- **Supabase** (recommended): Free tier available
- **Supabase**: PostgreSQL with real-time features
- **PlanetScale**: MySQL-compatible option
- **Railway**: Simple database hosting

### 5. Redeploy

After adding environment variables, trigger a redeploy from the Vercel dashboard.

## 📁 Project Structure

```
BizModelAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── data/           # Static data
├── server/                 # Express backend
│   ├── services/           # Business logic
│   └── routes.ts           # API routes
├── shared/                 # Shared types and utilities
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies and scripts
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Development Ports

- **Backend (API server):** Always runs on [http://localhost:9000](http://localhost:9000)
- **Frontend (Vite dev server):** Always runs on [http://localhost:5173](http://localhost:5173)
- **SSR/Root-level Vite (if used):** Runs on [http://localhost:9001](http://localhost:9001)

If you see an error like `EADDRINUSE: address already in use`, another process is using that port. Kill it with:

```
lsof -i :9000 # or :5173 or :9001
kill -9 <PID>
```

There is no fallback or auto-increment logic. The server will fail if the port is in use.

## 📋 Features

- **AI-Powered Analysis**: Personalized business model recommendations
- **Comprehensive Quiz**: Multi-round personality and preference assessment
- **Interactive Results**: Visual business model comparisons
- **Payment Integration**: Stripe-powered premium features
- **Email Reports**: Automated report delivery
- **Responsive Design**: Works on all devices
