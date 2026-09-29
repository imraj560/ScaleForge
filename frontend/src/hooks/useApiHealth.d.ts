interface ApiHealth {
    status: string;
    instance: string;
}
export declare function useApiHealth(): {
    health: ApiHealth | null;
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useApiHealth.d.ts.map