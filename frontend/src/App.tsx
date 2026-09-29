
import { useApiHealth } from "./hooks/useApiHealth";
import { useApiRequest } from "./hooks/useApiRequest";
import MetricsDashboard from "./components/MetricsDashboard";
import { useLoadTest } from "./hooks/useLoadTest";

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
    const {
    running,
    progress,
    result,
    lerror,
    runLoadTest,
  } = useLoadTest();
  
  const {
    response,
    loading: requestLoading,
    error: requestError,
    sendRequest,
  } = useApiRequest();


  const apiOnline = health?.status === "ok";

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">D</div>
          <div>
            <h1>Distributed API Lab</h1>
            <p>System Overview</p>
          </div>
        </div>

        <span className="environment">
          <span className="status-dot" />
          Local Environment
        </span>
      </header>

      <main className="main-content">
        <section className="welcome">
          <div>
            <p className="eyebrow">INFRASTRUCTURE MONITORING</p>
            <h2>System Overview</h2>
            <p className="subtitle">
              Monitor your distributed backend architecture.
            </p>
          </div>

          <div className="refresh-badge">
            <span className="status-dot" />
            Auto-refresh · 5 seconds
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <h3>API Health</h3>
            <span className={apiOnline ? "badge online" : "badge offline"}>
              {loading
                ? "Checking..."
                : apiOnline
                  ? "Operational"
                  : "Unavailable"}
            </span>
          </div>

          <div className="service-grid">
            <article className="service-card api-card">
              <div className="card-top">
                <div className="service-icon blue">API</div>
                <span
                  className={`status-dot ${
                    apiOnline ? "green" : "red"
                  }`}
                />
              </div>

              <h4>API Gateway</h4>
              <p className="service-description">
                Express API behind Nginx
              </p>

              <div className="card-divider" />

              <div className="card-detail">
                <span>Responding instance</span>
                <strong>
                  {loading
                    ? "Checking..."
                    : health?.instance ?? "Unavailable"}
                </strong>
              </div>

              <div className="card-detail">
                <span>Health</span>
                <strong>
                  {loading
                    ? "Checking..."
                    : apiOnline
                      ? "Healthy"
                      : error ?? "Unavailable"}
                </strong>
              </div>
            </article>

            {services.map((service) => (
              <article className="service-card" key={service.name}>
                <div className="card-top">
                  <div className="service-icon">
                    {service.name === "Nginx"
                      ? "NG"
                      : service.name === "Redis"
                        ? "RD"
                        : "DB"}
                  </div>
                  <span className="status-dot gray" />
                </div>

                <h4>{service.name}</h4>
                <p className="service-description">
                  {service.description}
                </p>

                <div className="card-divider" />

                <div className="card-detail">
                  <span>Monitoring</span>
                  <strong>{service.status}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <h3>API Instances</h3>
            <span className="badge neutral">
              3 configured instances
            </span>
          </div>

          <div className="instance-notice">
            <strong>Instance discovery in progress</strong>
            <p>
              Requests are routed through Nginx. The API health
              endpoint identifies the instance that responds to
              each request. Individual instance health monitoring
              will be added in a later step.
            </p>
          </div>
        </section>

        <button
            onClick={() => void runLoadTest(20, 5)}
            disabled={running}
          >
            {running ? `Running ${progress}%` : "Run Test"}
          </button>

          {result && (
            <pre>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}

          {lerror && <p>{lerror}</p>}

        <section className="section playground-section">
        <div className="section-heading">
          <div>
            <h3>API Playground</h3>
            <p className="section-description">
              Send real requests through the Nginx load balancer.
            </p>
          </div>
        </div>

        <div className="playground">
          <div className="request-panel">
            <div className="request-row">
              <span className="method-badge">GET</span>

              <code>/api/products</code>

              <button
                className="send-button"
                onClick={() => sendRequest("/api/products")}
                disabled={requestLoading}
              >
                {requestLoading ? "Sending..." : "Send Request"}
              </button>
            </div>

            <div className="request-row">
              <span className="method-badge">GET</span>

              <code>/api/health</code>

              <button
                className="send-button secondary"
                onClick={() => sendRequest("/api/health")}
                disabled={requestLoading}
              >
                Send Request
              </button>
            </div>

            <div className="request-row">
              <span className="method-badge">GET</span>

              <code>/metrics</code>

              <button
                className="send-button secondary"
                onClick={() => sendRequest("/metrics")}
                disabled={requestLoading}
              >
                Send Request
              </button>
            </div>
          </div>

          <div className="response-panel">
            <div className="response-header">
              <strong>Response</strong>

              {response && (
                <div className="response-meta">
                  <span className="response-status">
                    {response.status}
                  </span>

                  <span>{response.duration} ms</span>
                </div>
              )}
            </div>

            {requestError && (
              <div className="error-message">
                {requestError}
              </div>
            )}

            {!response && !requestError && !requestLoading && (
              <div className="empty-response">
                Send a request to inspect the API response.
              </div>
            )}

            {requestLoading && (
              <div className="empty-response">
                Sending request...
              </div>
            )}

            {response && (
              <pre className="json-response">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </section>

      <MetricsDashboard />

        <footer className="footer">
          Distributed API Lab · Built with React, Express, Redis,
          PostgreSQL & Nginx
        </footer>
      </main>
    </div>
  );
}

export default App;