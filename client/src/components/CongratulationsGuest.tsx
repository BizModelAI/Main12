import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  X,
  CheckCircle,
  Clock,
  Star,
  Zap,
} from "lucide-react";
import type { QuizData } from "../types";
import { getSessionId } from "../../../shared/utils";
import { useNavigate } from "react-router-dom";
// import { Modal } from "./ui/modal"; // If you have a modal component, otherwise use a simple div
// import { v4 as uuidv4 } from 'uuid';
const uuidv4 = () => crypto.randomUUID();

interface EmailCaptureProps {
  onEmailSubmit: (email: string) => void;
  onContinueAsGuest: () => void;
  onReturnToQuiz?: () => void;
  quizData?: QuizData;
  onStartAIGeneration: (email?: string) => void;
}

// Confetti component
const Confetti: React.FC = () => {
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      rotation: number;
      color: string;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // Generate confetti pieces
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      color: ["#3b82f6", "#8b5cf6", "#06d6a0", "#f59e0b", "#ef4444", "#ec4899"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 3,
    }));
    setConfettiPieces(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: piece.color,
            left: `${piece.x}%`,
          }}
          initial={{
            y: -20,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

const CongratulationsGuest: React.FC<EmailCaptureProps> = ({
  onEmailSubmit,
  onContinueAsGuest,
  onReturnToQuiz,
  quizData,
  onStartAIGeneration,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // --- Auto-save quizData and attemptId to localStorage on mount and every 10s ---
  useEffect(() => {
    function saveData() {
      if (quizData) {
        localStorage.setItem("quizData", JSON.stringify(quizData));
      }
      const attemptId = localStorage.getItem("currentQuizAttemptId");
      if (attemptId) {
        localStorage.setItem("currentQuizAttemptId", attemptId);
      }
    }
    saveData();
    const interval = setInterval(saveData, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [quizData]);

  // --- Show warning after 25 min, auto-redirect after 30 min ---
  useEffect(() => {
    const warningTimeout = setTimeout(() => setShowTimeoutWarning(true), 25 * 60 * 1000);
    const autoRedirectTimeout = setTimeout(() => {
      setShowTimeoutWarning(false);
      // Auto-continue to results
      if (quizData) {
        localStorage.setItem("quizData", JSON.stringify(quizData));
      }
      navigate("/results");
    }, 30 * 60 * 1000);
    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(autoRedirectTimeout);
    };
  }, [quizData, navigate]);


  const validateEmail = (email: string) => {
    // RFC 5322 Official Standard (simplified for practical use)
    // Must have at least one dot after @, and TLD must be at least 2 chars
    return (
      email.length > 5 &&
      /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(email.trim())
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (emailError) setEmailError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!quizData) {
      setEmailError("An internal error occurred. Please refresh and try again.");
      return;
    }

    setIsSubmitting(true);
    setEmailSent(false);
    setEmailError("");
    let quizAttemptId = null;
    let saveSuccess = false;

    try {
      // Check for existing account first
      const existingAccountRes = await fetch(`/api/check-existing-attempts/${encodeURIComponent(email.trim())}`);
      if (existingAccountRes.ok) {
        const existingAccount = await existingAccountRes.json();
        if (existingAccount?.hasAccount && existingAccount.userType === "paid") {
          setEmailError("You already have a paid account with this email. Please log in to access your results.");
          setIsSubmitting(false);
          return;
        }
      }

      // Save quiz data and create temporary account
      if (quizData) {
        const existingQuizAttemptId = localStorage.getItem("currentQuizAttemptId");
        
        if (!existingQuizAttemptId) {
        const response = await fetch("/api/save-quiz-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizData, email: email.trim() }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.userType === "existing-paid") {
            setEmailError("You already have a paid account with this email. Please log in to access your results.");
            setIsSubmitting(false);
            return;
          }
          setEmailError("Failed to save your quiz data. Please try again.");
          setIsSubmitting(false);
          return;
        }
        
        const result = await response.json();
        saveSuccess = true;
        if (result.attemptId) {
          quizAttemptId = result.attemptId;
          localStorage.setItem("quizAttemptId", quizAttemptId.toString());
        }
        localStorage.setItem("userEmail", email.trim());
        } else {
          // Quiz data already exists, just use the existing attempt
          quizAttemptId = existingQuizAttemptId;
          saveSuccess = true;
          localStorage.setItem("userEmail", email.trim());
        }
      }
      
      // Send the preview email (unpaid user)
      if (saveSuccess) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for email sending
        const emailRes = await fetch("/api/send-quiz-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: email.trim(), 
            quizData,
            attemptId: quizAttemptId 
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (emailRes.ok) {
          setEmailSent(true);
          setTimeout(() => {
            onStartAIGeneration(email);
          }, 1000); // Show success for 1s before navigating
        } else {
          setEmailSent(false);
          setEmailError("Failed to send email. Please try again.");
        }
      } else {
        setEmailSent(false);
        setEmailError("Failed to save your quiz data. Please try again.");
      }
    } catch (error) {
      setEmailSent(false);
      if (error instanceof Error && error.name === 'AbortError') {
        setEmailError("Email sending timed out. Please try again.");
      } else {
        setEmailError("Failed to send email. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestContinue = () => {
    onStartAIGeneration();
  };

  const handleContinueToResults = () => {
    console.log('CongratulationsGuest: Preparing for navigation to results');

    // Ensure currentQuizAttemptId exists
    let attemptId = localStorage.getItem("currentQuizAttemptId");
    if (!attemptId) {
      attemptId = uuidv4();
      localStorage.setItem("currentQuizAttemptId", attemptId);
      console.log('Generated new attempt ID:', attemptId);
    }

    // Ensure all data is properly saved with extended expiration
    if (quizData) {
      localStorage.setItem("quizData", JSON.stringify(quizData));
      localStorage.setItem("quizDataTimestamp", Date.now().toString());
      // Set expiration to 24 hours from now to prevent premature cleanup
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("quizDataExpires", expirationTime.toString());
      console.log('Saved quiz data with expiration:', new Date(expirationTime));
    }

    // Small delay to ensure data is written before navigation
    setTimeout(() => {
      console.log('Navigating to results page');
      navigate("/results");
    }, 100);
  };

  // Remove the useEffect that navigates away after emailSent

  return (
    <>
      {showTimeoutWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still there?</h2>
            <p className="mb-4">For your security, you'll be automatically redirected to your results in 5 minutes to prevent data loss.</p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold mt-2"
              onClick={() => setShowTimeoutWarning(false)}
            >
              Stay on this page
            </button>
          </div>
        </div>
      )}
      {/* Confetti Animation */}
      <Confetti />

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full h-auto relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"></div>

          <div className="relative px-8 py-6 md:px-12 md:py-8">
            {/* Celebration Header */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-6"
            >
              <div className="text-5xl mb-4 emoji">🎉</div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-600"
              >
                Your AI personalized report is ready.
              </motion.p>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-xl md:text-2xl font-bold text-gray-900 mb-3"
              >
                Get Your Results Delivered!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-gray-600 leading-relaxed"
              >
                Enter your email to receive a personalized link to your results.
                You can always return to view your complete business blueprint.
              </motion.p>
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="grid md:grid-cols-3 gap-3 mb-6"
            >
              {[
                {
                  icon: CheckCircle,
                  title: "3-Month Storage",
                  description: "Your results saved securely for 90 days",
                },
                {
                  icon: Clock,
                  title: "Email Delivery",
                  description: "Get results delivered to your inbox",
                },
                {
                  icon: Star,
                  title: "Upgrade Option",
                  description: "Convert to permanent storage anytime",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center p-3 bg-white/60 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                >
                  <benefit.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              onSubmit={handleSubmit}
              className="mb-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    required
                  />
                  {emailError && <div className="text-red-600 text-sm mt-1">{emailError}</div>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !!emailError || !validateEmail(email)}
                  className={`w-full sm:w-auto sm:min-w-[176px] px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                    isSubmitting || !email.trim() || !!emailError || !validateEmail(email)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Get Results
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            {/* Success Message */}
            {emailSent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center mb-4"
              >
                <button
                  type="button"
                  disabled
                  className="bg-green-50 border border-green-200 text-green-800 font-medium px-8 py-4 rounded-full text-lg shadow-lg flex items-center justify-center cursor-default"
                  style={{ minWidth: '320px' }}
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Email sent successfully! Redirecting to your results...
                </button>
              </motion.div>
            )}

            {/* Privacy Note & Continue as Guest */}
            {!emailSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="text-center space-y-3"
              >
                <p className="text-xs text-gray-500">
                  <span className="emoji">🔒</span> We respect your privacy. By entering your email, your results will be securely saved for 3 months.
                </p>

                <button
                  onClick={handleGuestContinue}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center justify-center group text-sm mx-auto"
                >
                  Continue as Guest (results won’t be saved)
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CongratulationsGuest;
