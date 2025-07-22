import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

interface ReportUnlockStatus {
  isUnlocked: boolean;
  paymentId: number | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useReportUnlock = (
  quizAttemptId: number | null,
  paymentId?: number | null
): ReportUnlockStatus => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [resolvedPaymentId, setResolvedPaymentId] = useState<number | null>(paymentId ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkUnlockStatus = async () => {
    if (!user || !quizAttemptId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // If paymentId is provided, check payment status directly
      if (resolvedPaymentId) {
        const response = await fetch(`/api/payment-status/${resolvedPaymentId}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to check payment status");
        const data = await response.json();
        setIsUnlocked(data.status === "succeeded" || data.status === "completed");
        setIsLoading(false);
        return;
      }
      // Otherwise, try to find a completed payment for this quizAttemptId
      const response = await fetch(`/api/admin/payments`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      const completedPayment = (data as any[]).find(
        (p) => p.quizAttemptId === quizAttemptId && p.status === "completed"
      );
      if (completedPayment) {
        setResolvedPaymentId(completedPayment.id);
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsUnlocked(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUnlockStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, quizAttemptId, resolvedPaymentId]);

  return {
    isUnlocked,
    paymentId: resolvedPaymentId,
    isLoading,
    error,
    refresh: checkUnlockStatus,
  };
};
