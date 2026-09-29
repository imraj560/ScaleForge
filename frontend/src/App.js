import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApiHealth } from "./hooks/useApiHealth";
import { useApiRequest } from "./hooks/useApiRequest";
import MetricsDashboard from "./components/MetricsDashboard";
import LoadTestPanel from "./components/LoadTestPanel";
import "./App.css";
const services = [
    {
        name: "Nginx",
        description: "Load balancer",
        status: "Configured",
    },
    {
        name: "Redis",
        description: "Cache & rate limiting",
        status: "Monitoring later",
    },
    {
        name: "PostgreSQL",
        description: "Persistent database",
        status: "Monitoring later",
    },
];
function App() {
    const { health, loading, error } = useApiHealth();
    const { response, loading: requestLoading, error: requestError, sendRequest, } = useApiRequest();
    const apiOnline = health?.status === "ok";
    return (_jsxs("div", { className: "dashboard", children: [_jsxs("header", { className: "topbar", children: [_jsxs("div", { className: "brand", children: [_jsx("div", { className: "brand-icon", children: "D" }), _jsxs("div", { children: [_jsx("h1", { children: "Distributed API Lab" }), _jsx("p", { children: "System Overview" })] })] }), _jsxs("span", { className: "environment", children: [_jsx("span", { className: "status-dot" }), "Local Environment"] })] }), _jsxs("main", { className: "main-content", children: [_jsxs("section", { className: "welcome", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "INFRASTRUCTURE MONITORING" }), _jsx("h2", { children: "System Overview" }), _jsx("p", { className: "subtitle", children: "Monitor your distributed backend architecture." })] }), _jsxs("div", { className: "refresh-badge", children: [_jsx("span", { className: "status-dot" }), "Auto-refresh \u00B7 5 seconds"] })] }), _jsxs("section", { className: "section", children: [_jsxs("div", { className: "section-heading", children: [_jsx("h3", { children: "API Instances" }), _jsx("span", { className: "badge neutral", children: "3 configured instances" })] }), _jsxs("div", { className: "instance-notice", children: [_jsx("strong", { children: "Instance discovery in progress" }), _jsx("p", { children: "Requests are routed through Nginx. The API health endpoint identifies the instance that responds to each request. Individual instance health monitoring will be added in a later step." })] })] }), _jsxs("section", { className: "section", children: [_jsxs("div", { className: "section-heading", children: [_jsx("h3", { children: "API Health" }), _jsx("span", { className: apiOnline ? "badge online" : "badge offline", children: loading
                                            ? "Checking..."
                                            : apiOnline
                                                ? "Operational"
                                                : "Unavailable" })] }), _jsxs("div", { className: "service-grid", children: [_jsxs("article", { className: "service-card api-card", children: [_jsxs("div", { className: "card-top", children: [_jsx("div", { className: "service-icon blue", children: "API" }), _jsx("span", { className: `status-dot ${apiOnline ? "green" : "red"}` })] }), _jsx("h4", { children: "API Gateway" }), _jsx("p", { className: "service-description", children: "Express API behind Nginx" }), _jsx("div", { className: "card-divider" }), _jsxs("div", { className: "card-detail", children: [_jsx("span", { children: "Responding instance" }), _jsx("strong", { children: loading
                                                            ? "Checking..."
                                                            : health?.instance ?? "Unavailable" })] }), _jsxs("div", { className: "card-detail", children: [_jsx("span", { children: "Health" }), _jsx("strong", { children: loading
                                                            ? "Checking..."
                                                            : apiOnline
                                                                ? "Healthy"
                                                                : error ?? "Unavailable" })] })] }), services.map((service) => (_jsxs("article", { className: "service-card", children: [_jsxs("div", { className: "card-top", children: [_jsx("div", { className: "service-icon", children: service.name === "Nginx"
                                                            ? "NG"
                                                            : service.name === "Redis"
                                                                ? "RD"
                                                                : "DB" }), _jsx("span", { className: "status-dot gray" })] }), _jsx("h4", { children: service.name }), _jsx("p", { className: "service-description", children: service.description }), _jsx("div", { className: "card-divider" }), _jsxs("div", { className: "card-detail", children: [_jsx("span", { children: "Monitoring" }), _jsx("strong", { children: service.status })] })] }, service.name)))] })] }), _jsxs("section", { className: "section playground-section", children: [_jsx("div", { className: "section-heading", children: _jsxs("div", { children: [_jsx("h3", { children: "API Playground" }), _jsx("p", { className: "section-description", children: "Send real requests through the Nginx load balancer." })] }) }), _jsxs("div", { className: "playground", children: [_jsxs("div", { className: "request-panel", children: [_jsxs("div", { className: "request-row", children: [_jsx("span", { className: "method-badge", children: "GET" }), _jsx("code", { children: "/api/products" }), _jsx("button", { className: "send-button", onClick: () => sendRequest("/api/products"), disabled: requestLoading, children: requestLoading ? "Sending..." : "Send Request" })] }), _jsxs("div", { className: "request-row", children: [_jsx("span", { className: "method-badge", children: "GET" }), _jsx("code", { children: "/api/health" }), _jsx("button", { className: "send-button secondary", onClick: () => sendRequest("/api/health"), disabled: requestLoading, children: "Send Request" })] }), _jsxs("div", { className: "request-row", children: [_jsx("span", { className: "method-badge", children: "GET" }), _jsx("code", { children: "/metrics" }), _jsx("button", { className: "send-button secondary", onClick: () => sendRequest("/metrics"), disabled: requestLoading, children: "Send Request" })] })] }), _jsxs("div", { className: "response-panel", children: [_jsxs("div", { className: "response-header", children: [_jsx("strong", { children: "Response" }), response && (_jsxs("div", { className: "response-meta", children: [_jsx("span", { className: "response-status", children: response.status }), _jsxs("span", { children: [response.duration, " ms"] })] }))] }), requestError && (_jsx("div", { className: "error-message", children: requestError })), !response && !requestError && !requestLoading && (_jsx("div", { className: "empty-response", children: "Send a request to inspect the API response." })), requestLoading && (_jsx("div", { className: "empty-response", children: "Sending request..." })), response && (_jsx("pre", { className: "json-response", children: JSON.stringify(response.data, null, 2) }))] })] })] }), _jsx(LoadTestPanel, {}), _jsx(MetricsDashboard, {}), _jsx("footer", { className: "footer", children: "Distributed API Lab \u00B7 Built with React, Express, Redis, PostgreSQL & Nginx" })] })] }));
}
export default App;
//# sourceMappingURL=App.js.map