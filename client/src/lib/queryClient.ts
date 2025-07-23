import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// NOTE: This project now uses JWT cookie authentication for all protected endpoints.
// Ensure all requests to protected endpoints use credentials: 'include'.

// Default fetcher function for React Query
const defaultFetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// API request helper function
export const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
) => {
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };
  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Set up React Query's default fetcher
queryClient.setDefaultOptions({
  queries: {
    queryFn: ({ queryKey }) => defaultFetcher(queryKey[0] as string),
  },
});
