import { useState } from "react";
export function useLoadTest() {
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [lerror, setLError] = useState(null);
    const runLoadTest = async (requestCount, concurrency) => {
        if (running)
            return;
        setRunning(true);
        setProgress(0);
        setResult(null);
        setLError(null);
        const start = performance.now();
        let completed = 0;
        let successful = 0;
        let failed = 0;
        const statusCodes = {};
        const instances = {};
        const executeRequest = async () => {
            const requestStart = performance.now();
            try {
                const response = await fetch("/api/health");
                const data = await response.json();
                const status = String(response.status);
                statusCodes[status] =
                    (statusCodes[status] ?? 0) + 1;
                if (data.instance) {
                    instances[data.instance] =
                        (instances[data.instance] ?? 0) + 1;
                }
                if (response.ok) {
                    successful++;
                }
                else {
                    failed++;
                }
            }
            catch {
                failed++;
            }
            finally {
                completed++;
                setProgress(Math.round((completed / requestCount) * 100));
            }
            return performance.now() - requestStart;
        };
        try {
            const latencies = [];
            let nextRequest = 0;
            const worker = async () => {
                while (nextRequest < requestCount) {
                    nextRequest++;
                    const latency = await executeRequest();
                    latencies.push(latency);
                }
            };
            const workers = Array.from({
                length: Math.min(concurrency, requestCount),
            }, () => worker());
            await Promise.all(workers);
            const duration = performance.now() - start;
            const averageLatency = latencies.length > 0
                ? latencies.reduce((sum, value) => sum + value, 0) /
                    latencies.length
                : 0;
            setResult({
                totalRequests: requestCount,
                successfulRequests: successful,
                failedRequests: failed,
                duration,
                requestsPerSecond: duration > 0
                    ? requestCount / (duration / 1000)
                    : 0,
                averageLatency,
                statusCodes,
                instances,
            });
        }
        catch (err) {
            setLError(err instanceof Error
                ? err.message
                : "Load test failed");
        }
        finally {
            setRunning(false);
        }
    };
    return {
        running,
        progress,
        result,
        lerror,
        runLoadTest,
    };
}
//# sourceMappingURL=useLoadTest.js.map