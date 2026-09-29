import { useState } from "react";
export function useApiRequest() {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function sendRequest(url) {
        setLoading(true);
        setError(null);
        setResponse(null);
        const start = performance.now();
        try {
            const response = await fetch(url);
            const duration = Math.round(performance.now() - start);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || `Request failed with status ${response.status}`);
            }
            setResponse({
                data,
                status: response.status,
                duration,
                instance: data?.instance,
                source: data?.source,
            });
        }
        catch (err) {
            setError(err instanceof Error
                ? err.message
                : "Unable to complete request");
        }
        finally {
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
//# sourceMappingURL=useApiRequest.js.map