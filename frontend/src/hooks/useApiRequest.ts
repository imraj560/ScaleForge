import { useState } from "react";
import { API_URL } from "../config/api";

interface ApiResponse {
  data: unknown;
  status: number;
  duration: number;
  instance?: string;
  source?: string;
}

export function useApiRequest() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendRequest(url: string) {
    setLoading(true);
    setError(null);
    setResponse(null);

    const start = performance.now();

    try {
      const requestUrl = url.startsWith("http")
        ? url
        : `${API_URL}${url}`;

      const response = await fetch(requestUrl);

      const duration = Math.round(performance.now() - start);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || `Request failed with status ${response.status}`
        );
      }

      setResponse({
        data,
        status: response.status,
        duration,
        instance: data?.instance,
        source: data?.source,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete request"
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    response,
    loading,
    error,
    sendRequest,
  };
}