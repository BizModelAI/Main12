import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get pricing for user without creating payment intent
router.get("/user-pricing/:userId", async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const pricingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    
    if (!pricingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Determine pricing: $9.99 for new users, $4.99 for paid users
    const payments = await prisma.payment.findMany({
      where: { userId: parseInt(userId), status: 'completed' }
    });
    
    let amountDollar;
    if ((pricingUser.isPaid === true && !pricingUser.isTemporary) || payments.length > 0) {
      // Paid users (converted from temporary) get $4.99 for subsequent quizzes
      amountDollar = "4.99";
    } else {
      // New users (temporary) pay $9.99 for first quiz
      amountDollar = "9.99";
    }

    res.json({
      success: true,
      pricing: {
        amount: amountDollar,
        currency: 'USD',
        isPaid: pricingUser.isPaid || payments.length > 0
      }
    });
  } catch (error) {
    console.error("Error getting user pricing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Stripe configuration endpoint (secure - only exposes publishable key)
router.get("/stripe-config", (req: express.Request, res: express.Response) => {
  const origin = process.env.FRONTEND_URL || req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;

  res.json({
    publishableKey: publishableKey || null,
    configured: hasSecretKey,
    status: hasSecretKey ? "ready" : "not_configured",
  });
});

// Get payment status by payment ID
router.get("/payment/:paymentId", async (req: express.Request, res: express.Response) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: "Missing payment ID" });
    }

    // First try to find the payment in our database
    const payment = await prisma.payment.findFirst({
      where: { 
        OR: [
          { id: paymentId },
          { stripePaymentIntentId: paymentId }
        ]
      }
    });

    if (payment) {
      return res.json({
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        userId: payment.userId
      });
    }

    // If not found in database, try to get from Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        
        res.json({
          paymentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        return res.status(404).json({ error: "Payment not found" });
      }
    } else {
      return res.status(404).json({ error: "Payment not found" });
    }
  } catch (error) {
    console.error("Error getting payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router; 