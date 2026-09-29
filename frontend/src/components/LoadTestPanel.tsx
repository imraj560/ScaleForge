import { useState } from "react";
import { useLoadTest } from "../hooks/useLoadTest";

export default function LoadTestPanel() {
  const [requestCount, setRequestCount] = useState(50);
  const [concurrency, setConcurrency] = useState(5);

  const {
    running,
    progress,
    result,
    lerror,
    runLoadTest,
  } = useLoadTest();

  const handleRunTest = () => {
    void runLoadTest(requestCount, concurrency);
  };

  return (
    <section className="load-test">
      <div className="load-test-header">
        <div>
          <h2>Load Testing</h2>
          <p>
            Generate concurrent traffic and observe the distributed API.
          </p>
        </div>

        <span className="load-test-badge">
          {running ? "Running" : "Ready"}
        </span>
      </div>

      <div className="load-test-controls">
        <label>
          Requests
          <select
            value={requestCount}
            onChange={(event) =>
              setRequestCount(Number(event.target.value))
            }
            disabled={running}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
        </label>

        <label>
          Concurrency
          <select
            value={concurrency}
            onChange={(event) =>
              setConcurrency(Number(event.target.value))
            }
            disabled={running}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <button
          className="load-test-button"
          onClick={handleRunTest}
          disabled={running}
        >
          {running ? `Running ${progress}%` : "Run Load Test"}
        </button>
      </div>

      {running && (
        <div className="load-progress">
          <div
            className="load-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {lerror && (
        <div className="load-test-error">
          {lerror}
        </div>
      )}

      {result && !running && (
        <>
          <div className="load-test-summary">
            <div className="load-stat">
              <span>Requests/sec</span>
              <strong>
                {result.requestsPerSecond.toFixed(2)}
              </strong>
            </div>

            <div className="load-stat">
              <span>Avg. Latency</span>
              <strong>
                {result.averageLatency.toFixed(2)} ms
              </strong>
            </div>

            <div className="load-stat">
              <span>Successful</span>
              <strong>
                {result.successfulRequests}
              </strong>
            </div>

            <div className="load-stat">
              <span>Failed</span>
              <strong>
                {result.failedRequests}
              </strong>
            </div>
          </div>

          <div className="load-test-details">
            <div>
              <h3>HTTP Status Codes</h3>

              {Object.entries(result.statusCodes).map(
                ([status, count]) => (
                  <div className="load-row" key={status}>
                    <span>HTTP {status}</span>
                    <strong>{count}</strong>
                  </div>
                )
              )}
            </div>

            <div>
              <h3>API Instance Distribution</h3>

              {Object.entries(result.instances).map(
                ([instance, count]) => (
                  <div className="load-row" key={instance}>
                    <span>{instance}</span>
                    <strong>{count}</strong>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="load-test-footer">
            {result.totalRequests} requests completed in{" "}
            {(result.duration / 1000).toFixed(2)} seconds
          </div>
        </>
      )}
    </section>
  );
}