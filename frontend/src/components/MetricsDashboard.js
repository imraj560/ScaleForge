import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, } from "recharts";
import { useMetrics } from "../hooks/useMetrics";
const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];
export default function MetricsDashboard() {
    const { metrics, loading, error, refresh } = useMetrics();
    if (loading && !metrics)
        return _jsx("p", { children: "Loading metrics..." });
    if (error && !metrics)
        return _jsx("p", { children: error });
    if (!metrics)
        return null;
    const statusData = Object.entries(metrics.statusCodes).map(([status, count]) => ({
        status: `HTTP ${status}`,
        count,
    }));
    return (_jsxs("section", { className: "metrics-dashboard", children: [_jsxs("div", { className: "metrics-header", children: [_jsxs("div", { children: [_jsx("h2", { children: "API Metrics" }), _jsx("p", { children: "Live performance metrics from Prometheus" })] }), _jsx("button", { onClick: () => void refresh(), children: "Refresh" })] }), error && _jsx("p", { className: "metrics-error", children: error }), _jsxs("div", { className: "metrics-cards", children: [_jsxs("article", { className: "metric-card", children: [_jsx("span", { children: "Total Requests" }), _jsx("strong", { children: metrics.totalRequests.toLocaleString() })] }), _jsxs("article", { className: "metric-card", children: [_jsx("span", { children: "Average Response Time" }), _jsxs("strong", { children: [metrics.averageResponseTime.toFixed(2), " ms"] })] }), _jsxs("article", { className: "metric-card", children: [_jsx("span", { children: "HTTP Status Types" }), _jsx("strong", { children: Object.keys(metrics.statusCodes).length })] })] }), _jsxs("div", { className: "metrics-charts", children: [_jsxs("article", { className: "chart-card", children: [_jsx("h3", { children: "Requests by HTTP Status" }), _jsx(ResponsiveContainer, { width: "100%", height: 280, children: _jsxs(BarChart, { data: statusData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "status" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#2563eb" })] }) })] }), _jsxs("article", { className: "chart-card", children: [_jsx("h3", { children: "HTTP Status Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 280, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: statusData, dataKey: "count", nameKey: "status", cx: "50%", cy: "50%", outerRadius: 90, label: true, children: statusData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, entry.status))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) })] })] })] }));
}
//# sourceMappingURL=MetricsDashboard.js.map