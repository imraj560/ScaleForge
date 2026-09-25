function App() {
  return (
    <div>
      <header>
        <h1>Scale Forge</h1>
        <p>
          Interactive visualization of a horizontally scaled backend.
        </p>
      </header>

      <main>
        <section>
          <h2>System Status</h2>

          <div>
            <div>
              <strong>Nginx</strong>
              <p>Online</p>
            </div>

            <div>
              <strong>API 1</strong>
              <p>Online</p>
            </div>

            <div>
              <strong>API 2</strong>
              <p>Online</p>
            </div>

            <div>
              <strong>API 3</strong>
              <p>Online</p>
            </div>

            <div>
              <strong>Redis</strong>
              <p>Online</p>
            </div>

            <div>
              <strong>PostgreSQL</strong>
              <p>Online</p>
            </div>
          </div>
        </section>

        <section>
          <h2>API Playground</h2>

          <button>GET /api/products</button>
          <button>GET /api/health</button>
          <button>GET /metrics</button>
        </section>
      </main>
    </div>
  );
}

export default App;