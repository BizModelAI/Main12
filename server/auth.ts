import * as express from "express";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Temporary session cache as fallback for cookie issues
export const tempSessionCache = new Map<
  string,
  { userId: number; timestamp: number }
>();

// Periodic cleanup to prevent memory leaks in session cache
const SESSION_CLEANUP_INTERVAL = 15 * 60 * 1000; // Clean up every 15 minutes
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [key, session] of tempSessionCache.entries()) {
    if (now - session.timestamp > SESSION_MAX_AGE) {
      tempSessionCache.delete(key);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(
      ` Session cache cleanup: removed ${cleanedCount} expired sessions`,
    );
  }
}, SESSION_CLEANUP_INTERVAL);

// Helper function to get session key from request
export function getSessionKey(req: any): string {
  // Use a combination of IP and User-Agent as session key
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const userAgent = (req.headers as any)["user-agent"] || "unknown";
  return `${ip}-${userAgent}`;
}

// Helper function to get user from session or cache
export function getUserIdFromRequest(req: any): number | undefined {
  // First try normal session
  if ((req as any).session?.userId) {
    return (req as any).session.userId;
  }

  // Fallback to temporary cache
  const sessionKey = getSessionKey(req);
  const cachedSession = tempSessionCache.get(sessionKey);

  if (cachedSession) {
    // Check if session is still valid (24 hours)
    const now = Date.now();
    if (now - cachedSession.timestamp < 24 * 60 * 60 * 1000) {
      // Found user in cache, restore to session for consistency
      (req as any).session.userId = cachedSession.userId;
      console.log(
        `Session restored from cache: userId ${cachedSession.userId} for sessionKey ${sessionKey}`,
      );
      return cachedSession.userId;
    } else {
      // Cleanup expired session
      tempSessionCache.delete(sessionKey);
    }
  }

  return undefined;
}

// Helper function to set user in session and cache
export function setUserIdInRequest(req: any, userId: number): void {
  // Set in normal session
  (req as any).session.userId = userId;

  // Also set in cache as fallback
  const sessionKey = getSessionKey(req);
  tempSessionCache.set(sessionKey, {
    userId: userId,
    timestamp: Date.now(),
  });
}

// Helper function to set user in session and cache with forced save
export function setUserIdInRequestAndSave(req: any, userId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Set in normal session
    (req as any).session.userId = userId;

    // Also set in cache as fallback
    const sessionKey = getSessionKey(req);
    tempSessionCache.set(sessionKey, {
      userId: userId,
      timestamp: Date.now(),
    });

    // Force save the session
    (req as any).session.save((err: any) => {
      if (err) {
        console.error("Error saving session:", err);
        reject(err);
      } else {
        console.log(`Session saved successfully for user ${userId}`);
        resolve();
      }
    });
  });
}

// Session types are now declared in server/types.d.ts

export function setupAuthRoutes(app: any) {
  // Add this middleware at the top of setupAuthRoutes
  app.use((req: any, res: any, next: any) => {
    if ((req as any).path.startsWith("/api/auth/")) {
      const origin = process.env.FRONTEND_URL || (req.headers as any).origin || "*";
      (res as any).header("Access-Control-Allow-Origin", origin);
      (res as any).header("Access-Control-Allow-Credentials", "true");
      (res as any).header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      (res as any).header("Access-Control-Allow-Headers", "Content-Type,Authorization");
      if (req.method === "OPTIONS") {
        return (res as any).sendStatus(200);
      }
    }
    next();
  });

  // Add this middleware at the top of setupAuthRoutes, after CORS middleware
  app.use((req: any, res: any, next: any) => {
    if ((req as any).path.startsWith("/api/auth/")) {
      console.log("[SESSION DEBUG] Incoming /api/auth/* request", {
        path: (req as any).path,
        method: req.method,
        cookies: (req.headers as any).cookie,
        sessionId: (req as any).sessionID,
        sessionUserId: (req as any).session?.userId,
        sessionExists: !!(req as any).session,
        userAgent: (req.headers as any)["user-agent"]?.substring(0, 50),
      });
    }
    next();
  });

  // Cookie test endpoint - sets a test value and returns session info
  app.get("/api/auth/cookie-test", async (req: any, res: any) => {
    const testValue = `test-${Date.now()}`;
    (req as any).session.testValue = testValue;

    (res as any).json({
      sessionId: (req as any).sessionID,
      testValue: testValue,
      sessionExists: !!(req as any).session,
      cookieHeader: (req.headers as any).cookie?.substring(0, 100) + "..." || "none",
      userAgent: (req.headers as any)["user-agent"]?.substring(0, 50) + "..." || "none",
      setCookieHeader: (res as any).getHeaders()["set-cookie"] || "none",
    });
  });

  // Debug endpoint to check session state
  app.get("/api/auth/session-debug", async (req: any, res: any) => {
    (res as any).json({
      sessionId: (req as any).sessionID,
      userId: (req as any).session?.userId,
      testValue: (req as any).session?.testValue || "none",
      sessionExists: !!(req as any).session,
      cookieHeader: (req.headers as any).cookie?.substring(0, 100) + "..." || "none",
      userAgent: (req.headers as any)["user-agent"]?.substring(0, 50) + "..." || "none",
    });
  });

  // Debug endpoint to dump session and cookies for troubleshooting
  app.get("/api/auth/debug", async (req: any, res: any) => {
    console.log("/api/auth/debug called", {
      sessionId: (req as any).sessionID,
      session: (req as any).session,
      cookies: (req.headers as any).cookie,
      userAgent: (req.headers as any)["user-agent"]?.substring(0, 100) || "none",
    });
    (res as any).json({
      sessionId: (req as any).sessionID,
      session: (req as any).session,
      cookies: (req.headers as any).cookie,
      userAgent: (req.headers as any)["user-agent"]?.substring(0, 100) || "none",
    });
  });

  // Debug endpoint to dump session and cookies for troubleshooting
  app.get("/api/auth/session-dump", async (req: any, res: any) => {
    (res as any).json({
      sessionId: (req as any).sessionID,
      session: (req as any).session,
      cookies: (req.headers as any).cookie,
      userAgent: (req.headers as any)["user-agent"]?.substring(0, 100) || "none",
    });
  });

  // Test endpoint to set and check session
  app.post("/api/auth/session-test", async (req: any, res: any) => {
    try {
      const testValue = `test-${Date.now()}`;
      (req as any).session.testValue = testValue;

      console.log("Session test: Setting test value", {
        sessionId: (req as any).sessionID,
        testValue: testValue,
        sessionExists: !!(req as any).session,
      });

      (res as any).json({
        success: true,
        sessionId: (req as any).sessionID,
        testValue: testValue,
        message: "Test value set in session",
      });
    } catch (error) {
      console.error("Session test error:", error);
      (res as any).status(500).json({ error: "Session test failed" });
    }
  });

  app.get("/api/auth/session-test", async (req: any, res: any) => {
    (res as any).json({
      sessionId: (req as any).sessionID,
      testValue: (req as any).session?.testValue || null,
      sessionExists: !!(req as any).session,
      cookieHeader: (req.headers as any).cookie?.substring(0, 100) + "..." || "none",
    });
  });

  // Get current user session
  app.get("/api/auth/me", async (req: any, res: any) => {
    try {
      const userId = getUserIdFromRequest(req);

      console.log("Auth check: /api/auth/me called", {
        sessionId: (req as any).sessionID,
        userIdFromSession: (req as any).session?.userId,
        userIdFromCache: userId,
        sessionExists: !!(req as any).session,
        hasUserAgent: !!(req.headers as any)["user-agent"],
        origin: (req.headers as any).origin,
        referer: (req.headers as any).referer,
        sessionKey: getSessionKey(req),
      });

      if (!userId) {
        console.log("Auth check: No userId found in session or cache");
        return (res as any).status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        console.log("Auth check: User not found for userId:", userId);
        (req as any).session.userId = undefined;
        // Also clear from cache
        const sessionKey = getSessionKey(req);
        tempSessionCache.delete(sessionKey);
        return (res as any).status(401).json({ error: "User not found" });
      }

      console.log("Auth check: Success for user:", {
        id: user.id,
        email: user.email,
        name: (user.firstName || "") + (user.lastName ? " " + user.lastName : ""),
      });

      // Don't send password
      const { password, ...userWithoutPassword } = user;
      (res as any).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in /api/auth/me:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack trace",
        sessionId: (req as any).sessionID,
        userId: (req as any).session.userId,
      });
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: any, res: any) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      console.log("[DEBUG] Login attempt for email:", email);
      if (!user) {
        console.log("[DEBUG] No user found for email:", email);
        return (res as any).status(401).json({ error: "Invalid credentials" });
      }
      console.log("[DEBUG] Found user:", { 
        id: user.id, 
        email: user.email, 
        passwordHash: user.password, 
        isTemporary: user.isTemporary,
        isPaid: user.isPaid,
        sessionId: user.sessionId,
        expiresAt: user.expiresAt
      });

      // Check if user is temporary (unpaid) - also check for empty passwords which indicate temporary users
      if (user.isTemporary || !user.password || user.password === "") {
        console.log("[DEBUG] Temporary user attempted to log in:", email, {
          isTemporary: user.isTemporary,
          hasPassword: !!user.password,
          passwordLength: user.password?.length || 0
        });
        console.warn(`[AUTH] Denied login for temporary/unpaid user: ${email}`);
        return (res as any).status(403).json({ 
          error: "You need to pay to access your dashboard. Please purchase a report to unlock login access.",
          userType: "temporary",
          suggestion: "payment_required"
        });
      }

      // Check password (only for non-temporary users)
      const validPassword = await bcrypt.compare(password, user.password);
      console.log("[DEBUG] bcrypt.compare result:", validPassword);
      if (!validPassword) {
        return (res as any).status(401).json({ error: "Invalid credentials" });
      }

      // Set session using helper (sets both session and cache)
      setUserIdInRequest(req, user.id);
      console.info(`[AUTH] Session set for paid user: ${user.email}, userId: ${user.id}`);
      console.log("[DEBUG] setUserIdInRequest called for user:", {
        id: user.id,
        email: user.email,
        isTemporary: user.isTemporary,
        isPaid: user.isPaid,
        sessionId: (req as any).sessionID,
        sessionUserId: (req as any).session?.userId,
        sessionData: (req as any).session
      });

      // TEMPORARY FIX: Force save with explicit session management
      // This ensures the userId is saved and available for subsequent requests

      console.log("Login: Before session save", {
        sessionId: (req as any).sessionID,
        userEmail: user.email,
        sessionData: (req as any).session,
        setCookieHeader: (res as any).getHeaders()["set-cookie"],
      });

      // Force session save before sending response
      (req as any).session.save((err: any) => {
        if (err) {
          console.error("Login: Failed to save session:", err);
          return (res as any).status(500).json({ error: "Session save failed" });
        }

        // Log after session save
        console.log("Login: After session save", {
          sessionId: (req as any).sessionID,
          userId: user.id,
          userEmail: user.email,
          sessionSaved: !!(req as any).session.userId,
          sessionData: (req as any).session,
          setCookieHeader: (res as any).getHeaders()["set-cookie"],
        });
        // Print all response headers for debugging
        console.log("Login: Response headers after session save:", (res as any).getHeaders());

        // Don't send password
        const { password: _, ...userWithoutPassword } = user;
        (res as any).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Error in /api/auth/login:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Signup - Store temporary account data until payment
  app.post("/api/auth/signup", async (req: any, res: any) => {
    // Ensure we always return JSON
    (res as any).header("Content-Type", "application/json");

    try {
      console.log("Signup attempt started for:", (req.body as any)?.email || "unknown");

      // Validate request body exists
      if (!req.body || typeof req.body !== "object") {
        console.log("Signup validation failed: invalid request body");
        return (res as any).status(400).json({ error: "Invalid request body" });
      }

      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        console.log("Signup validation failed: missing required fields");
        return res
          .status(400)
          .json({ error: "Email, password, first name, and last name are required" });
      }

      // Basic email validation
      if (!email.includes("@") || email.length < 5) {
        console.log("Signup validation failed: invalid email format");
        return res
          .status(400)
          .json({ error: "Please enter a valid email address" });
      }

      // Password validation
      if (password.length < 8) {
        console.log("Signup validation failed: password too short");
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        console.log("Signup validation failed: password complexity");
        return (res as any).status(400).json({
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        });
      }

      console.log("Checking if user already exists...");

      // Check if user already exists as a paid user
      let existingUser;
      try {
        existingUser = await storage.getUserByEmail(email);
      } catch (dbError) {
        console.error("Database error checking existing user:", dbError);
        return (res as any).status(500).json({
          error: "Database connection error. Please try again.",
          details:
            process.env.NODE_ENV === "development"
              ? dbError instanceof Error
                ? dbError.message
                : String(dbError)
              : undefined,
        });
      }

      // Only block signup if a non-temporary user exists
      if (existingUser && !existingUser.isTemporary) {
        console.log("User already exists, returning 409");
        return (res as any).status(409).json({ error: "User already exists" });
      }

      console.log("User doesn't exist, proceeding with temporary storage...");

      // Store temporary account data (no real account created yet)
      // We'll create the actual account only after successful payment
      const sessionId =
        (req as any).sessionID ||
        `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      console.log("Generated sessionId:", sessionId);

      // Get quiz data from request or localStorage indication
      const quizData = (req.body as any).quizData || {};

      console.log("Hashing password...");
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (hashError) {
        console.error("Password hashing error:", hashError);
        return (res as any).status(500).json({
          error: "Password processing error. Please try again.",
        });
      }

      console.log("Storing temporary user...");
      try {
        await storage.storeTemporaryUser(sessionId, email, {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          quizData,
        });
      } catch (storageError) {
        console.error("Storage error:", storageError);
        return (res as any).status(500).json({
          error: "Failed to create account. Please try again.",
          details:
            process.env.NODE_ENV === "development"
              ? storageError instanceof Error
                ? storageError.message
                : String(storageError)
              : undefined,
        });
      }

      console.log("Signup successful, establishing session and returning temporary user data");
      
      // Get the actual user ID from storage
      const tempUser = await storage.getTemporaryUser(sessionId);
      if (tempUser) {
        // Establish session for the temporary user with the correct numeric ID
        setUserIdInRequest(req, tempUser.id);
        
        // Force session save
        (req as any).session.save((err: any) => {
          if (err) {
            console.error("Signup: Failed to save session:", err);
            // Continue anyway - the user can still proceed
          }
          
      // Return a temporary user object for frontend
          (res as any).json({
            id: tempUser.id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            isTemporary: true,
          });
        });
      } else {
        // Fallback if user not found
      (res as any).json({
        id: `temp_${sessionId}`,
        email: email,
        firstName: firstName,
        lastName: lastName,
        isTemporary: true,
      });
      }
    } catch (error) {
      console.error("Unexpected error in /api/auth/signup:", error);
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace",
      );
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : "Unknown",
        code: (error as any)?.code || "Unknown",
        body: req.body,
        sessionID: (req as any).sessionID,
      });

      // Ensure we return JSON even in unexpected errors
      if (!(res as any).headersSent) {
        (res as any).status(500).json({
          error: "An unexpected error occurred. Please try again.",
          details:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.message
                : String(error)
              : undefined,
        });
      }
    }
  });

  // Logout
  const logoutHandler = async (req: any, res: any) => {
    try {
      const sessionKey = getSessionKey(req);
      (req as any).session.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
          return (res as any).status(500).json({ error: "Could not log out" });
        }
        // Remove from tempSessionCache as well
        tempSessionCache.delete(sessionKey);
        (res as any).clearCookie("connect.sid");
        (res as any).json({ success: true });
      });
    } catch (error) {
      console.error("Error in /api/auth/logout:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  };
  app.post("/api/auth/logout", logoutHandler);
  app.get("/api/auth/logout", logoutHandler);

  // Update profile
  app.put("/api/auth/profile", async (req: any, res: any) => {
    try {
      const userId = getUserIdFromRequest(req);

      if (!userId) {
        console.log(
          "Profile update: Not authenticated, sessionUserId:",
          (req as any).session?.userId,
          "cacheUserId:",
          userId,
          "sessionKey:",
          getSessionKey(req),
        );
        return (res as any).status(401).json({ error: "Not authenticated" });
      }

      const updates = req.body;
      console.log(
        "Profile update: Received updates for userId",
        userId,
        ":",
        updates,
      );

      const user = await storage.updateUser(userId, updates);
      console.log("Profile update: Updated user:", {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      // Don't send password
      const { password: _, ...userWithoutPassword } = user;
      (res as any).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in /api/auth/profile:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Delete account
  app.delete("/api/auth/account", async (req: any, res: any) => {
    try {
      if (!(req as any).session.userId) {
        return (res as any).status(401).json({ error: "Not authenticated" });
      }

      const userId = (req as any).session.userId;

      // Delete all user data from database
      await storage.deleteUser(userId);

      // Destroy session
      (req as any).session.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res
            .status(500)
            .json({ error: "Could not complete account deletion" });
        }
        (res as any).clearCookie("connect.sid");
        (res as any).json({ success: true, message: "Account deleted successfully" });
      });
    } catch (error) {
      console.error("Error in /api/auth/account:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Forgot password
  app.post("/api/auth/forgot-password", async (req: any, res: any) => {
    try {
      const { email } = req.body;

      if (!email) {
        return (res as any).status(400).json({ error: "Email is required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal whether the email exists or not for security
        return (res as any).json({
          message:
            "If an account with that email exists, we've sent password reset instructions.",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Store reset token in database
      await storage.createPasswordResetToken(
        user.id,
        resetToken,
        resetTokenExpiry,
      );

      // Send email with reset link
      try {
        const { emailService } = await import("./services/emailService");
        const baseUrl = (req as any).get("host")?.includes("localhost")
          ? `${(req as any).protocol}://${(req as any).get("host")}`
          : "https://bizmodelai.com";
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        const result = await emailService.sendPasswordResetEmail(
          email,
          resetUrl,
        );

        if (result.success) {
          (res as any).json({
            message:
              "If an account with that email exists, we've sent password reset instructions.",
          });
        } else {
          // Still return success message for security (don't reveal if email exists)
          (res as any).json({
            message:
              "If an account with that email exists, we've sent password reset instructions.",
          });
        }
      } catch (emailError) {
        console.error("Error sending password reset email:", emailError);
        // Still return success message for security (don't reveal if email exists)
        (res as any).json({
          message:
            "If an account with that email exists, we've sent password reset instructions.",
        });
      }
    } catch (error) {
      console.error("Error in /api/auth/forgot-password:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Verify reset token
  app.get(
    "/api/auth/verify-reset-token/:token",
    async (req: any, res: any) => {
      try {
        const { token } = (req as any).params;

        if (!token) {
          return (res as any).status(400).json({ error: "Reset token is required" });
        }

        const resetData = await storage.getPasswordResetToken(token);

        if (!resetData || resetData.expiresAt < new Date()) {
          return res
            .status(400)
            .json({ error: "Invalid or expired reset token" });
        }

        (res as any).json({ valid: true });
      } catch (error) {
        console.error("Error in /api/auth/verify-reset-token:", error);
        (res as any).status(500).json({ error: "Internal server error" });
      }
    },
  );

  // Unsubscribe from emails
  app.post("/api/auth/unsubscribe", async (req: any, res: any) => {
    try {
      const { email } = req.body;

      if (!email) {
        return (res as any).status(400).json({ error: "Email is required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (user) {
        // Update user to mark as unsubscribed
        await storage.updateUser(user.id, { isUnsubscribed: true });
        console.log(`User ${email} has been unsubscribed from emails`);
      }

      // Always return success to prevent email enumeration
      (res as any).json({
        success: true,
        message: "Successfully unsubscribed from all emails",
      });
    } catch (error) {
      console.error("Error in /api/auth/unsubscribe:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Reset password
  app.post("/api/auth/reset-password", async (req: any, res: any) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res
          .status(400)
          .json({ error: "Token and password are required" });
      }

      // Validate password strength
      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return (res as any).status(400).json({
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        });
      }

      const resetData = await storage.getPasswordResetToken(token);

      if (!resetData || resetData.expiresAt < new Date()) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      // Update user password
      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.updateUserPassword(resetData.userId, hashedPassword);

      // Delete the used reset token
      await storage.deletePasswordResetToken(token);

      (res as any).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error in /api/auth/reset-password:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Change password (authenticated users)
  app.post("/api/auth/change-password", async (req: any, res: any) => {
    try {
      const userId = getUserIdFromRequest(req);

      if (!userId) {
        return (res as any).status(401).json({ error: "Not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return (res as any).status(400).json({
          error: "Current password and new password are required",
        });
      }

      if (newPassword.length < 8) {
        return (res as any).status(400).json({
          error: "New password must be at least 8 characters long",
        });
      }

      // Get current user to verify current password
      const user = await storage.getUser(userId);
      if (!user) {
        return (res as any).status(404).json({ error: "User not found" });
      }

      // Verify current password
      const validCurrentPassword = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!validCurrentPassword) {
        return (res as any).status(400).json({ error: "Current password is incorrect" });
      }

      // Hash new password and update
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUserPassword(userId, hashedNewPassword);

      console.log(
        `Password changed successfully for user ${userId} (${user.email})`,
      );
      (res as any).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error in /api/auth/change-password:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req: any, res: any) => {
    try {
      const { name, email, subject, message, category } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message || !category) {
        return (res as any).status(400).json({
          error: "All fields are required",
        });
      }

      // Basic email validation
      if (!email.includes("@") || email.length < 5) {
        return (res as any).status(400).json({
          error: "Please enter a valid email address",
        });
      }

      console.log(`New contact form submission from: ${email}`);

      const { emailService } = await import("./services/emailService");

      // Send notification to team@bizmodelai.com
      let notificationSent = false;
      try {
        const notificationResult = await emailService.sendContactFormNotification({
          name,
          email,
          subject,
          message,
          category,
        });
        notificationSent = notificationResult.success;
      } catch (emailError) {
        console.error("Error sending contact form notification:", emailError);
        return (res as any).status(500).json({
          error: "Failed to send notification email. Please try again later.",
        });
      }

      if (!notificationSent) {
        console.error("Failed to send contact form notification");

        // In development, just log the form data instead of failing
        if (process.env.NODE_ENV === "development") {
          console.log("=== CONTACT FORM SUBMISSION (Development Mode) ===");
          console.log("Name:", name);
          console.log("Email:", email);
          console.log("Category:", category);
          console.log("Subject:", subject);
          console.log("Message:", message);
          console.log("=== END CONTACT FORM ===");

          // Continue to success even if email fails in development
        } else {
          return (res as any).status(500).json({
            error: "Failed to send notification to team",
          });
        }
      }

      // Send confirmation email to user
      let confirmationSent = false;
      try {
        const confirmationResult = await emailService.sendContactFormConfirmation(
          email,
          name,
        );
        confirmationSent = confirmationResult.success;
      } catch (emailError) {
        console.log(
          "Failed to send confirmation email to user, but notification was sent:",
          emailError,
        );
        // Don't fail the request if confirmation email fails
      }

      if (!confirmationSent) {
        console.log(
          "Confirmation email failed to send, but notification was sent successfully",
        );
        // Don't fail the request if confirmation email fails
      }

      console.log(`Contact form processed successfully for: ${email}`);
      (res as any).json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    } catch (error) {
      console.error("Error in /api/contact:", error);
      (res as any).status(500).json({ error: "Internal server error" });
    }
  });
}
