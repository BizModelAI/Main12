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
      // Use the new report unlock status endpoint
      const response = await fetch(`/api/report-unlock-status/${user.id}/${quizAttemptId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to check unlock status");
      const data = await response.json();
      setIsUnlocked(data.isUnlocked);
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
