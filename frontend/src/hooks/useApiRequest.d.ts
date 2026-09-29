interface ApiResponse {
    data: unknown;
    status: number;
    duration: number;
    instance?: string;
    source?: string;
}
export declare function useApiRequest(): {
    response: ApiResponse | null;
    loading: boolean;
    error: string | null;
    sendRequest: (url: string) => Promise<void>;
};
export {};
//# sourceMappingURL=useApiRequest.d.ts.map