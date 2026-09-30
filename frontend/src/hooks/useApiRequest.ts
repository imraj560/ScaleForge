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

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data
            ? String(data.message)
            : `Request failed with status ${response.status}`;

        throw new Error(message);
      }

      setResponse({
        data,
        status: response.status,
        duration,
        instance:
          typeof data === "object" &&
          data !== null &&
          "instance" in data
            ? String(data.instance)
            : undefined,
        source:
          typeof data === "object" &&
          data !== null &&
          "source" in data
            ? String(data.source)
            : undefined,
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