
import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

interface ApiHealth {
  status: string;
  instance: string;
}

export function useApiHealth() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

   async function checkHealth() {
  try {
    console.log("API_URL inside hook:", API_URL);

    const url = `${API_URL}/api/health`;

    console.log("Requesting:", url);

    const response = await fetch(url);

    console.log("Response:", response.status);

   

        const contentType =
          response.headers.get("content-type") || "";

        const responseText = await response.text();

        console.log("Health status:", response.status);
        console.log("Health content type:", contentType);
        console.log("Health response:", responseText);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${responseText}`
          );
        }

        if (!contentType.includes("application/json")) {
          throw new Error(
            `Expected JSON but received ${contentType || "unknown content type"}`
          );
        }

        const data: ApiHealth = JSON.parse(responseText);

        if (isMounted) {
          setHealth(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setHealth(null);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to reach API"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void checkHealth();

    const interval = setInterval(() => {
      void checkHealth();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { health, loading, error };
}

