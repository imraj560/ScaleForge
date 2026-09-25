
import { useApiHealth } from "./hooks/useApiHealth";
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

        <footer className="footer">
          Distributed API Lab · Built with React, Express, Redis,
          PostgreSQL & Nginx
        </footer>
      </main>
    </div>
  );
}

export default App;