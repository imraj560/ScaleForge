export interface ApiMetrics {
    totalRequests: number;
    averageResponseTime: number;
    statusCodes: Record<string, number>;
    requestsByInstance: Record<string, number>;
}
export declare function useMetrics(): {
    metrics: ApiMetrics | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useMetrics.d.ts.map