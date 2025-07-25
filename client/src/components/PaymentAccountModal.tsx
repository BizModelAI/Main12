import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
  User,
  Mail,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usePaywall } from "../contexts/PaywallContext";
import { EnhancedPaymentWrapper } from "./EnhancedPaymentForm";
import { API_ROUTES, apiPost } from "../utils/apiClient";

interface PaymentAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "business-model" | "learn-more" | "full-report";
  title?: string;
}

export const PaymentAccountModal: React.FC<PaymentAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  type,
  title,
}) => {
  const [step, setStep] = useState<"account" | "login" | "payment">("account");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, login, user, deleteAccount } = useAuth();
  const { setHasUnlockedAnalysis, setHasCompletedQuiz } = usePaywall();

  const [error, setError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [amount, setAmount] = useState(user ? 4.99 : 9.99);

  // Account form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Track if email was pre-filled from localStorage
  const [emailWasPrefilled, setEmailWasPrefilled] = useState(false);

  // Pre-fill email from localStorage if available and not logged in
  useEffect(() => {
    if (isOpen && !user && !formData.email) {
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
      if (storedEmail && storedEmail.length > 4) {
        setFormData((prev) => ({ ...prev, email: storedEmail }));
        setEmailWasPrefilled(true);
      } else {
        setEmailWasPrefilled(false);
      }
    }
  }, [isOpen, user, formData.email]);

  // Ensure correct step and price for logged-in users on modal open
  useEffect(() => {
    if (isOpen && user) {
      setStep("payment");
      setAmount(4.99);
    }
    if (isOpen && !user) {
      setStep("account");
      setAmount(9.99);
    }
  }, [isOpen, user]);

  // Handle cleanup when user closes modal on payment step
  const handleClose = async () => {
    if (step === "payment" && user) {
      // For temporary accounts, attempt cleanup but don't block modal closing
      try {
        await deleteAccount();
      } catch (error) {
        // Ignore errors during cleanup - temporary accounts expire automatically
        console.debug(
          "Account cleanup skipped (will expire automatically):",
          error instanceof Error ? error.message : String(error),
        );
      }
    }
    
    // Clean up email storage
    localStorage.removeItem("userEmail");
    
    onClose();
  };

  // Handle browser close/refresh during payment step
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step === "payment" && user) {
        // Show warning to user but don't attempt async operations
        // Temporary accounts will expire automatically on the server
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your payment process will be cancelled.";
      }
    };

    if (step === "payment" && user) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step, user]);

  // Auto-advance to payment step if user is already logged in
  useEffect(() => {
    if (isOpen && user && step === "account") {
      // User is already logged in, skip to payment
      const initializePayment = async () => {
        try {
          await fetchReportPricing();
          setStep("payment");
        } catch (error) {
          console.error(
            "Failed to initialize payment for logged-in user:",
            error,
          );
        }
      };
      initializePayment();
    }
  }, [isOpen, user, step]);

  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case "business-model":
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle: `Create your account and unlock personalized insights for ${user ? "$4.99" : "$9.99"}`,
        };
      case "learn-more":
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle: title
            ? `Create your account to access detailed insights about ${title}`
            : "Create your account and unlock personalized business insights",
        };
      case "full-report":
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle:
            "Create your account and get your complete AI-powered success report",
        };
      default:
        return {
          title: "Unlock Your Full Business Blueprint",
          subtitle: "Create your account and unlock all features",
        };
    }
  };

  const content = getContent();

  const validateAccountForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    return true;
  };

  // Helper to ensure quizAttemptId is set before payment
  const ensureQuizAttemptId = async (email: string) => {
    const quizData = localStorage.getItem("quizData");
    const parsedQuizData = quizData ? JSON.parse(quizData) : {};
    let quizAttemptId;
    try {
      const saveResponse = await fetch("/api/save-quiz-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizData: parsedQuizData, email }),
      });
      if (saveResponse.ok) {
        const saveData = await saveResponse.json();
        if (saveData.quizAttemptId != null) {
          quizAttemptId = saveData.quizAttemptId;
          localStorage.setItem("currentQuizAttemptId", String(quizAttemptId));
        }
      }
    } catch (saveErr) {
      console.error("Error saving quiz data before payment:", saveErr);
    }
    return quizAttemptId;
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateAccountForm()) return;

    setIsProcessing(true);
    try {
      console.log(
        "PaymentAccountModal: Starting signup for email:",
        formData.email,
      ); // Debug log

      // Include quiz data in signup for temporary account storage
      const quizData = localStorage.getItem("quizData");
      const parsedQuizData = quizData ? JSON.parse(quizData) : {};

      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        parsedQuizData,
      );

      // Check if quiz data already exists before saving
      let quizAttemptId = localStorage.getItem("currentQuizAttemptId");
      
      if (!quizAttemptId) {
        try {
          const saveResponse = await fetch("/api/save-quiz-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quizData: parsedQuizData, email: formData.email }),
          });
          if (saveResponse.ok) {
            const saveData = await saveResponse.json();
            if (saveData.quizAttemptId != null) {
              quizAttemptId = saveData.quizAttemptId;
              localStorage.setItem("currentQuizAttemptId", String(quizAttemptId));
            }
          }
        } catch (saveErr) {
          console.error("Error saving quiz data after signup:", saveErr);
        }
      }

      console.log("PaymentAccountModal: Signup and quiz save successful, moving to payment");
      
      // Store email in localStorage for payment form access
      localStorage.setItem("userEmail", formData.email);
      
      await fetchReportPricing();
      setStep("payment");
    } catch (err: any) {
      console.log("PaymentAccountModal: Signup error caught:", {
        message: err.message,
        status: err.status,
        stack: err.stack,
      });

      // Check for user already exists error - try multiple approaches
      const errorMessage = (err.message || "").toLowerCase();
      const isUserExistsError =
        errorMessage.includes("user already exists") ||
        errorMessage.includes("already exists") ||
        errorMessage === "user already exists" ||
        // Handle exact server error message
        errorMessage === "user already exists" ||
        // Handle more variations
        errorMessage.includes("email already") ||
        errorMessage.includes("account already") ||
        errorMessage.includes("email is already") ||
        // Check HTTP status code for conflict
        err.status === 409;

      console.log("PaymentAccountModal: Error analysis:", {
        errorMessage,
        isUserExistsError,
        status: err.status,
      });

      if (isUserExistsError) {
        console.log(
          "PaymentAccountModal: User exists, switching to login step",
        );
        setLoginEmail(formData.email);
        setStep("login");
        setError("");
      } else {
        console.log("PaymentAccountModal: Other error:", err.message);
        setError(err.message || "Failed to create account");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsProcessing(true);
    try {
      // Perform login and get user data
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Incorrect email or password";
        let errorData: any = {};
        
        try {
          errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        
        // Handle temporary user login attempt
        if (response.status === 403 && errorData.userType === "temporary") {
          console.log("PaymentAccountModal: Temporary user attempted to log in");
          setError("You need to pay to access your dashboard. Please purchase a report to unlock login access.");
          return;
        }
        
        throw new Error(errorMessage);
      }

      const userData = await response.json();

      // Update auth context
      await login(loginEmail, formData.password);
      
      // Store email in localStorage for payment form access
      localStorage.setItem("userEmail", loginEmail);

      // Always save quiz data after login to ensure we have a fresh quiz attempt ID
      // NOTE: /api/save-quiz-data is not implemented in the new backend.
      // TODO: Implement this endpoint or update this logic if saving quiz data is required.
      /*
      const savedQuizData = localStorage.getItem("quizData");
      
      if (savedQuizData) {
        try {
          const quizData = JSON.parse(savedQuizData);
          console.log("PaymentAccountModal: Saving quiz data after login for user:", loginEmail);
          
          const saveResponse = await fetch("/api/save-quiz-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ quizData }),
          });
        } catch (error) {
          console.error("Error saving quiz data after login:", error);
        }
      }
      */

      // In the new pay-per-report model, logged-in users proceed to payment for report unlock
      await fetchReportPricing(); // Get the correct pricing for this user
      setStep("payment");
    } catch (err: any) {
      setError(err.message || "Incorrect email or password");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setHasUnlockedAnalysis(true);
    localStorage.setItem("hasAnyPayment", "true");
    localStorage.setItem("hasUnlockedAnalysis", "true");

    // Always ensure quiz data is saved after successful payment
    const savedQuizData = localStorage.getItem("quizData");
    
    if (savedQuizData) {
      try {
        const quizData = JSON.parse(savedQuizData);
        console.log("PaymentAccountModal: Saving quiz data after successful payment");
        
        const response = await fetch("/api/save-quiz-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ quizData }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.quizAttemptId) {
            localStorage.setItem(
              "currentQuizAttemptId",
              data.quizAttemptId.toString(),
            );
            console.log("PaymentAccountModal: Updated quiz attempt ID after payment:", data.quizAttemptId);
          }
        }

        // Set quiz completion flag so user can access features
        setHasCompletedQuiz(true);
        localStorage.setItem("hasCompletedQuiz", "true");

        console.log("PaymentAccountModal: Quiz data saved to user account after payment");
      } catch (error) {
        console.error("PaymentAccountModal: Error saving quiz data after payment:", error);
      }
    } else {
      console.log("PaymentAccountModal: No quiz data found after payment");
    }

    // Clean up email storage after successful payment
    localStorage.removeItem("userEmail");
    
    // Close the modal and trigger success handler
    onSuccess();

    // Force a reload to ensure the site updates with latest quiz and full access
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const fetchReportPricing = async () => {
    if (!user) return;

    try {
      // Determine if this is a temporary user
      const isTemporaryUser =
        user.isTemporary || user.id.toString().startsWith("temp_");

      if (isTemporaryUser) {
        // Anonymous users always pay $9.99
        setAmount(9.99);
      } else {
        // Logged users get dynamic pricing from the API
        const storedQuizAttemptId = localStorage.getItem(
          "currentQuizAttemptId",
        );

        if (storedQuizAttemptId) {
          // User has a valid quiz attempt, create payment intent
          try {
            const data = await apiPost(API_ROUTES.USER_PRICING, {
              userId: user.id,
              quizAttemptId: parseInt(storedQuizAttemptId),
            });
            setAmount(parseFloat(data.amount) || 4.99);
          } catch (error) {
            console.error("Failed to create payment intent:", error);
            // Fallback to pricing endpoint
            await fetchUserPricing();
          }
        } else {
          // No quiz attempt ID, just get pricing for display
          await fetchUserPricing();
        }
      }
    } catch (error) {
      console.error("Error fetching report pricing:", error);
      // Try fallback pricing endpoint
      await fetchUserPricing();
    }
  };

  const fetchUserPricing = async () => {
    try {
      const response = await fetch(`/api/user-pricing/${user?.id}`, {
        credentials: "include",
      });

      if (response.ok) {
        try {
          const data = await response.json();
          setAmount(parseFloat(data.amount) || 4.99);
        } catch (parseError) {
          console.error(
            "Failed to parse JSON response from user-pricing:",
            parseError,
          );
          // Final fallback for logged users
          setAmount(4.99);
        }
      } else {
        // Final fallback for logged users
        setAmount(4.99);
      }
    } catch (error) {
      console.error("Error fetching user pricing:", error);
      // Fallback pricing for logged users should be $4.99 (returning user price)
      setAmount(4.99);
    }
  };

  const handleDevBypass = async () => {
    setIsProcessing(true);
    try {
      // If user isn't logged in, create a dev account
      if (!user) {
        const devEmail = `dev_${Date.now()}@test.com`;
        await signup(devEmail, "devpass123", "Dev", "User");
      }

      // Mark as unlocked
      setHasUnlockedAnalysis(true);
      localStorage.setItem("hasAnyPayment", "true");
      localStorage.setItem("devBypass", "true");

      // Save quiz data from localStorage to user's account
      const savedQuizData = localStorage.getItem("quizData");
      if (savedQuizData) {
        try {
          const quizData = JSON.parse(savedQuizData);
          await fetch("/api/auth/save-quiz-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ quizData }),
          });
          console.log("Quiz data saved to dev user account");
        } catch (error) {
          console.error("Error saving quiz data:", error);
        }
      }

      setIsProcessing(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Dev bypass failed");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden max-h-[90vh] overflow-y-auto my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"></div>

          <div className="relative p-6">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Lock Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {content.title}
              </h2>
              <p className="text-gray-600 text-sm">{content.subtitle}</p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === "account" || step === "login"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {step === "account" || step === "login" ? (
                  "1"
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </div>
              <div
                className={`w-12 h-1 mx-2 rounded-full ${step === "payment" ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-300"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === "payment"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Account Creation Form */}
            {step === "account" && (
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                      readOnly={!user && emailWasPrefilled}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account & Continue"
                  )}
                </button>

                {/* Dev Bypass Button */}
                {import.meta.env.MODE === 'development' && (
                  <button
                    type="button"
                    onClick={handleDevBypass}
                    disabled={isProcessing}
                    className="w-full bg-gray-600 text-white py-2 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                     DEV: Bypass Payment (Remove in Prod)
                  </button>
                )}
              </form>
            )}

            {/* Login Form */}
            {step === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-blue-800 text-sm font-medium mb-1">
                    Welcome back!
                  </p>
                  <p className="text-blue-700 text-sm">
                    We found an existing account with this email. Please enter
                    your password to continue.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                      placeholder="Enter your email"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Logging In...
                    </>
                  ) : (
                    "Log In & Access Features"
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("account");
                      setError("");
                      setLoginEmail("");
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back to Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* Payment Form */}
            {step === "payment" && (
              <div className="space-y-4">
                {(() => {
                  const stored = typeof window !== 'undefined' ? localStorage.getItem("currentQuizAttemptId") : null;
                  const quizAttemptId = stored ? parseInt(stored) : undefined;
                  if (!quizAttemptId) {
                    return <div className="text-red-600 text-center font-bold">Error: Quiz attempt not found. Please retake the quiz or contact support.</div>;
                  }
                  return (
                    <EnhancedPaymentWrapper
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      amount={amount}
                      quizAttemptId={quizAttemptId}
                    />
                  );
                })()}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
