"use client";

import { useLoading } from "../components/providers/LoadingProvider";

export function useApiWithLoading() {
  const { startLoading, stopLoading } = useLoading();

  const fetchWithLoading = async (url: string, options?: RequestInit) => {
    startLoading();
    try {
      const response = await fetch(url, options);
      return response;
    } finally {
      stopLoading();
    }
  };

  return { fetchWithLoading };
}
