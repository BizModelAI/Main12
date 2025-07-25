import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, Clock, Star, User } from "lucide-react";
import type { QuizData } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
const uuidv4 = () => crypto.randomUUID();

interface LoggedInCongratulationsProps {
  onContinue: () => void;
  onSendEmailPreview: () => void;
  quizData?: QuizData;
  onStartAIGeneration: () => void;
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

const CongratulationsLoggedIn: React.FC<LoggedInCongratulationsProps> = ({
  onContinue,
  onSendEmailPreview,
  quizData,
  onStartAIGeneration,
}) => {
  const { user } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      onStartAIGeneration();
    }, 30 * 60 * 1000);
    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(autoRedirectTimeout);
    };
  }, [quizData, onStartAIGeneration]);

  const handleSendEmail = async () => {
    setIsSubmitting(true);
    try {
      await onSendEmailPreview();
      setEmailSent(true);
      // Auto-redirect after 1 second, just like guest congratulations
      setTimeout(() => {
        onStartAIGeneration();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToResults = () => {
    console.log('CongratulationsLoggedIn: Preparing for navigation to results');

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

    // Now navigate or call onStartAIGeneration
    onStartAIGeneration();
  };

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
                Congratulations, {user?.firstName || user?.name || "there"}!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-600"
              >
                Your AI personalized report is ready and will be saved to your
                account.
              </motion.p>
            </motion.div>

            {/* Account Benefits Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center justify-center"
              >
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Logged in as: {user?.email}
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-xl md:text-2xl font-bold text-gray-900 mb-3"
              >
                Send Your Results
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-gray-600 leading-relaxed"
              >
                Would you like to receive an email preview of your results? You
                can always access them from your dashboard.
              </motion.p>
            </div>

            {/* Benefits for logged-in users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="grid md:grid-cols-3 gap-3 mb-6"
            >
              {[
                {
                  icon: CheckCircle,
                  title: "Automatically Saved",
                  description: "Results saved to your account dashboard",
                },
                {
                  icon: Clock,
                  title: "Permanent Access",
                  description: "View anytime from your dashboard",
                },
                {
                  icon: Star,
                  title: "Future Updates",
                  description: "Get notified of new insights and features",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center p-3 bg-white/60 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                >
                  <benefit.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Success Message */}
            {emailSent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Email sent successfully! Generating your full
                  report...
                </span>
              </motion.div>
            )}

            {/* Action Buttons */}
            {!emailSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="space-y-3"
              >
                {/* Send Email Button */}
                <button
                  onClick={handleSendEmail}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Mail className="mr-2 h-4 w-4 animate-spin" /> Sending Email...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" /> Send Email
                    </>
                  )}
                </button>
                {/* Continue Button */}
                <button
                  onClick={handleContinueToResults}
                  className="w-full text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center justify-center group text-sm py-2"
                >
                  Continue to Results
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* Privacy note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="text-center mt-4"
            >
              <p className="text-xs text-gray-500">
                 Your results are automatically saved to your account
                dashboard
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CongratulationsLoggedIn;
