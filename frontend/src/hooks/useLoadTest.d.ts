interface LoadTestResult {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    duration: number;
    requestsPerSecond: number;
    averageLatency: number;
    statusCodes: Record<string, number>;
    instances: Record<string, number>;
}
export declare function useLoadTest(): {
    running: boolean;
    progress: number;
    result: LoadTestResult | null;
    lerror: string | null;
    runLoadTest: (requestCount: number, concurrency: number) => Promise<void>;
};
export {};
//# sourceMappingURL=useLoadTest.d.ts.map