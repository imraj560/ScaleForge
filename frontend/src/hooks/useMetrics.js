import { useCallback, useEffect, useState } from "react";
export function useMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchMetrics = useCallback(async () => {
        try {
            const response = await fetch("/metrics");
            if (!response.ok) {
                throw new Error(`Metrics request failed: ${response.status}`);
            }
            const text = await response.text();
            const lines = text.split("\n");
            let totalRequests = 0;
            let durationSum = 0;
            let durationCount = 0;
            const statusCodes = {};
            for (const line of lines) {
                if (line.startsWith("http_requests_total{")) {
                    const match = line.match(/status_code="([^"]+)"/);
                    const value = Number(line.split(" ").at(-1));
                    if (!Number.isFinite(value))
                        continue;
                    totalRequests += value;
                    if (match) {
                        const status = match[1];
                        statusCodes[status] = (statusCodes[status] ?? 0) + value;
                    }
                }
                if (line.startsWith("http_request_duration_seconds_sum{")) {
                    durationSum += Number(line.split(" ").at(-1)) || 0;
                }
                if (line.startsWith("http_request_duration_seconds_count{")) {
                    durationCount += Number(line.split(" ").at(-1)) || 0;
                }
            }
            const averageResponseTime = durationCount > 0 ? (durationSum / durationCount) * 1000 : 0;
            setMetrics({
                totalRequests,
                averageResponseTime,
                statusCodes,
                requestsByInstance: {},
            });
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Unable to load metrics");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void fetchMetrics();
        const interval = setInterval(() => {
            void fetchMetrics();
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchMetrics]);
    return { metrics, loading, error, refresh: fetchMetrics };
}
//# sourceMappingURL=useMetrics.js.map