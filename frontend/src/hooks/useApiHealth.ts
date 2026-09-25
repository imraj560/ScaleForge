
import { useEffect, useState } from "react";

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
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: ApiHealth = await response.json();

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

    checkHealth();

    const interval = setInterval(checkHealth, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { health, loading, error };
}