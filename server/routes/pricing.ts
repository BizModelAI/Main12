import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = (express as any).Router();
const prisma = new PrismaClient();

// Get pricing for user without creating payment intent
(router as any).get("/user-pricing/:userId", async (req: any, res: any) => {
  try {
    const { userId } = (req as any).params;

    if (!userId) {
      return (res as any).status(400).json({ error: "Missing userId" });
    }

    const pricingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    
    if (!pricingUser) {
      return (res as any).status(404).json({ error: "User not found" });
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

    (res as any).json({
      success: true,
      pricing: {
        amount: amountDollar,
        currency: 'USD',
        isPaid: pricingUser.isPaid || payments.length > 0
      }
    });
  } catch (error: any) {
    console.error("Error getting user pricing:", error);
    (res as any).status(500).json({ error: "Internal server error" });
  }
});

// Stripe configuration endpoint (secure - only exposes publishable key)
(router as any).get("/stripe-config", (req: any, res: any) => {
  const origin = process.env.FRONTEND_URL || ((req.headers as any) as any).origin || "*";
  (res as any).header("Access-Control-Allow-Origin", origin);
  (res as any).header("Access-Control-Allow-Credentials", "true");
  (res as any).header("Access-Control-Allow-Methods", "GET, OPTIONS");
  (res as any).header("Access-Control-Allow-Headers", "Content-Type");
  
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;

  (res as any).json({
    publishableKey: publishableKey || null,
    configured: hasSecretKey,
    status: hasSecretKey ? "ready" : "not_configured",
  });
});

// Get payment status by payment ID
(router as any).get("/payment/:paymentId", async (req: any, res: any) => {
  try {
    const { paymentId } = (req as any).params;

    if (!paymentId) {
      return (res as any).status(400).json({ error: "Missing payment ID" });
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
      return (res as any).json({
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        userId: payment.userId
      });
    }

    // If not found in database, try to get from Stripe
    if (process.env.STRIPE_SECRET_KEY) {
  const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
      
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        
        (res as any).json({
          paymentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        return (res as any).status(404).json({ error: "Payment not found" });
      }
    } else {
      return (res as any).status(404).json({ error: "Payment not found" });
    }
  } catch (error: any) {
    console.error("Error getting payment status:", error);
    (res as any).status(500).json({ error: "Internal server error" });
  }
});

export default router; 