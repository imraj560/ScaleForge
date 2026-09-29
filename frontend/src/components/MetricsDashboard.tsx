import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useMetrics } from "../hooks/useMetrics";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

export default function MetricsDashboard() {
  const { metrics, loading, error, refresh } = useMetrics();

  if (loading && !metrics) return <p>Loading metrics...</p>;
  if (error && !metrics) return <p>{error}</p>;
  if (!metrics) return null;

  const statusData = Object.entries(metrics.statusCodes).map(
    ([status, count]) => ({
      status: `HTTP ${status}`,
      count,
    })
  );

  return (
    <section className="metrics-dashboard">
      <div className="metrics-header">
        <div>
          <h2>API Metrics</h2>
          <p>Live performance metrics from Prometheus</p>
        </div>

        <button onClick={() => void refresh()}>Refresh</button>
      </div>

      {error && <p className="metrics-error">{error}</p>}

      <div className="metrics-cards">
        <article className="metric-card">
          <span>Total Requests</span>
          <strong>{metrics.totalRequests.toLocaleString()}</strong>
        </article>

        <article className="metric-card">
          <span>Average Response Time</span>
          <strong>{metrics.averageResponseTime.toFixed(2)} ms</strong>
        </article>

        <article className="metric-card">
          <span>HTTP Status Types</span>
          <strong>{Object.keys(metrics.statusCodes).length}</strong>
        </article>
      </div>

      <div className="metrics-charts">
        <article className="chart-card">
          <h3>Requests by HTTP Status</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <h3>HTTP Status Distribution</h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}