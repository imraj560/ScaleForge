# Distributed API Lab

A production-oriented distributed API platform built to explore backend scalability, load balancing, distributed caching, rate limiting, observability, and cloud deployment.

The project started with a simple question:

> What happens behind the application when an API needs to handle more traffic?

Instead of building another CRUD application, this project focuses on the infrastructure and backend architecture that applications can run on.

## Live Demo

**Playground:** https://peaceful-fairy-a9f043.netlify.app/

**GitHub:** https://github.com/imraj560/apiLab

---

## Overview

Distributed API Lab is a full-stack system consisting of:

- Multiple Express API instances
- Nginx load balancing
- Redis for distributed rate limiting and caching
- PostgreSQL for persistent data
- Prometheus for metrics and observability
- React dashboard for testing and monitoring
- Docker Compose for local infrastructure
- Railway for cloud deployment

The local environment demonstrates a distributed architecture where multiple API instances share Redis and PostgreSQL.

```text
                         ┌─────────────────┐
                         │     Browser     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │      Nginx      │
                         │ Load Balancer   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
               ┌────────┐    ┌────────┐    ┌────────┐
               │  API 1 │    │  API 2 │    │  API 3 │
               └────┬───┘    └────┬───┘    └────┬───┘
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                       ┌──────────┴──────────┐
                       ▼                     ▼
                 ┌───────────┐        ┌────────────┐
                 │   Redis   │        │ PostgreSQL │
                 │ Cache /   │        │ Persistent │
                 │ Rate Limit│        │    Data    │
                 └───────────┘        └────────────┘
```

The cloud deployment currently uses a smaller architecture:

```text
Browser
   │
   ▼
Railway API
   │
   ├── Redis
   │
   └── PostgreSQL
```

The local and cloud environments intentionally demonstrate different deployment models.

---

# Key Features

## 1. Horizontal Scaling

The local environment runs multiple instances of the same Express API:

```text
API 1
API 2
API 3
```

Nginx distributes incoming requests between these instances.

Each API instance exposes its instance ID through:

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "instance": "api2"
}
```

This makes it possible to visually verify that requests are being distributed across the API instances.

### Why this matters

If one API instance becomes a bottleneck, additional instances can be introduced instead of continuously increasing the resources of a single server.

This is the foundation of horizontal scaling.

---

## 2. Nginx Load Balancing

Nginx acts as the entry point for the local API architecture.

```text
Client
  ↓
Nginx
  ↓
API1 / API2 / API3
```

A simplified upstream configuration looks like:

```nginx
upstream api_servers {
    server api1:3000;
    server api2:3000;
    server api3:3000;
}
```

Requests to the API are forwarded to the upstream API instances.

This allows the project to demonstrate how multiple stateless API servers can operate behind a single endpoint.

---

## 3. Distributed Rate Limiting

Rate limiting is implemented using Redis rather than in-memory application state.

The current implementation limits requests by client IP.

Conceptually:

```text
Request
   ↓
API Instance
   ↓
Redis INCR
   ↓
Request Count
   ↓
Allowed / Rate Limited
```

Because Redis is shared by all API instances, the rate limit remains global.

For example, if a client makes requests through:

```text
API1 → Redis
API2 → Redis
API3 → Redis
```

the request count is still maintained centrally.

Adding more API instances therefore does not create separate rate-limit buckets for each server.

---

## 4. Redis Response Caching

The products endpoint uses Redis to cache database responses.

```text
GET /api/products
        │
        ▼
      Redis
     /     \
  HIT       MISS
   │          │
   ▼          ▼
Return     PostgreSQL
Cache         │
              ▼
          Store in Redis
```

The cache currently uses the key:

```text
products
```

with a TTL of 60 seconds.

The response identifies whether the data came from PostgreSQL or Redis.

Example:

```json
{
  "source": "redis",
  "products": [...]
}
```

This makes the caching behavior visible through the dashboard.

---

# 5. PostgreSQL

PostgreSQL provides persistent application data.

The project currently uses a `products` table containing:

- `id`
- `name`
- `price`

The API retrieves product data from PostgreSQL when a cached response is unavailable.

Docker Compose also uses a persistent PostgreSQL volume so that database data survives container restarts.

---

# 6. Prometheus Observability

The API exposes Prometheus-compatible metrics through:

```http
GET /metrics
```

The project tracks HTTP request information including:

- Request count
- HTTP method
- Route
- Status code
- Request duration

A request counter is exposed as:

```text
http_requests_total
```

Request duration is tracked using:

```text
http_request_duration_seconds
```

This provides visibility into API traffic and latency.

---

# 7. React Monitoring Dashboard

The React frontend acts as an interactive control panel for the backend.

It includes:

### System Status

Displays API health and the currently responding API instance.

### API Playground

Allows visitors to send requests to endpoints such as:

```text
/api/health
/api/products
/metrics
```

The dashboard displays:

- Response
- Status code
- Request duration
- API instance
- Cache source

### Load Testing

The dashboard can generate multiple API requests with configurable:

- Total requests
- Concurrency

It reports:

- Successful requests
- Failed requests
- Total duration
- Requests per second
- Average latency
- HTTP status distribution
- API instance distribution

The goal is to make backend behavior observable rather than hiding it behind a static frontend.

---

# 8. Dockerized Infrastructure

The local environment is containerized using Docker Compose.

The architecture includes:

```text
frontend
nginx
api1
api2
api3
redis
postgres
```

Each component runs as an isolated service.

This makes the entire distributed environment reproducible on a development machine.

---

# Technology Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Frontend

- React
- TypeScript
- Vite
- Recharts

## Data & Infrastructure

- PostgreSQL
- Redis
- Docker
- Docker Compose
- Nginx

## Observability

- Prometheus
- `prom-client`

## Cloud

- Railway
- Netlify

---

# Project Structure

A simplified project structure:

```text
apiLab/
│
├── src/
│   ├── middleware/
│   │   ├── metrics.middleware.ts
│   │   └── rateLimiter.ts
│   │
│   ├── routes/
│   │   └── products.routes.ts
│   │
│   ├── db.ts
│   ├── redis.ts
│   ├── metrics.ts
│   └── server.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── config/
│       └── App.tsx
│
├── nginx/
│   └── nginx.conf
│
├── Dockerfile
├── Dockerfile.railway
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

---

# Running Locally

## Prerequisites

Install:

- Node.js
- Docker Desktop
- Git

Clone the repository:

```bash
git clone https://github.com/imraj560/apiLab.git
cd apiLab
```

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

---

# Environment Variables

The backend requires environment variables for PostgreSQL and Redis.

Example:

```env
DATABASE_URL=postgresql://appuser:apppassword@localhost:5432/distributed_api
REDIS_URL=redis://localhost:6379
```

For local Docker Compose, these values are configured for the containers.

The frontend can use:

```env
VITE_API_URL=
```

When running behind the local Nginx configuration, the frontend can use relative API paths.

---

# Start the Distributed Environment

Run:

```bash
docker compose up --build
```

The environment starts:

```text
API1
API2
API3
Nginx
Redis
PostgreSQL
```

The frontend can then be started separately with:

```bash
cd frontend
npm run dev
```

Open the Vite development URL shown in the terminal.

---

# Testing the Load Balancer

Once the local system is running, request:

```bash
curl.exe http://localhost/api/health
```

Run it multiple times.

The response should identify the API instance handling the request.

For example:

```json
{
  "status": "ok",
  "instance": "api1"
}
```

Another request may return:

```json
{
  "status": "ok",
  "instance": "api2"
}
```

and another:

```json
{
  "status": "ok",
  "instance": "api3"
}
```

This provides a simple way to observe Nginx distributing requests between API instances.

---

# Testing Redis Caching

Request:

```bash
curl.exe http://localhost/api/products
```

The first request may retrieve data from PostgreSQL.

A subsequent request within the cache TTL can be served from Redis.

The API response identifies the source:

```json
{
  "source": "redis"
}
```

This makes the effect of caching visible without needing to inspect Redis manually.

---

# Testing Prometheus Metrics

Request:

```bash
curl.exe http://localhost/metrics
```

The endpoint returns Prometheus-formatted metrics.

Example metrics include:

```text
http_requests_total
http_request_duration_seconds
```

The React dashboard parses these metrics and presents them in a more accessible format.

---

# Load Testing

The dashboard includes a load-testing panel.

A test can be configured using:

```text
Requests:     100
Concurrency:  10
```

Concurrency represents the maximum number of requests being processed at the same time.

For example:

```text
100 total requests
10 concurrent requests

Request 1 ─┐
Request 2  │
Request 3  │
...        ├── Running concurrently
Request 10 ┘

When one completes:
Request 11 starts
```

The dashboard then reports the observed performance.

These measurements depend on the machine, Docker resources, database workload, Redis performance, network conditions, and configuration.

---

# Cloud Deployment

The project is currently deployed using:

```text
Frontend → Netlify
API      → Railway
Redis    → Railway
Postgres → Railway
```

The public frontend is:

https://peaceful-fairy-a9f043.netlify.app/

The cloud deployment currently uses a single API service.

The local Nginx + three-instance architecture remains available for experimenting with horizontal scaling.

The next stage of the project is to continue experimenting with multiple API replicas and determine how performance changes as the system scales.

---

# Architecture Goals

This project is intentionally more than a CRUD API.

The main learning goals are:

### Scalability

Understand how multiple stateless API instances can work together.

### Distributed State

Understand why shared infrastructure such as Redis is needed when multiple API instances exist.

### Caching

Understand how caching can reduce repeated database work.

### Rate Limiting

Understand how distributed rate limiting can be implemented using Redis.

### Load Balancing

Understand how Nginx distributes requests between backend instances.

### Observability

Understand how metrics can expose system behavior.

### Performance Testing

Measure latency, throughput, concurrency, and instance distribution instead of assuming how the system performs.

### Cloud Deployment

Understand how the same application architecture changes when moving from local Docker infrastructure to managed cloud services.

---

# Future Improvements

Planned experiments include:

- Increase the number of API replicas
- Benchmark different concurrency levels
- Measure p95 and p99 latency
- Improve load-testing methodology
- Experiment with database bottlenecks
- Explore Redis bottlenecks
- Add automated tests
- Explore cloud-based horizontal scaling
- Compare different load-balancing strategies
- Improve observability and dashboards

One of the longer-term goals is to explore how far the architecture can be scaled and what becomes the bottleneck as traffic increases.

---

# What I Learned

The main lesson from this project was that scaling an API is not simply a matter of adding more servers.

Once multiple API instances exist, other questions appear:

- Where is shared state stored?
- How is rate limiting coordinated?
- What happens to cached data?
- How do we know which instance handled a request?
- What happens when the database becomes the bottleneck?
- How do we measure performance?
- How do we know whether scaling actually helped?

This project is an ongoing experiment to answer those questions through implementation and measurement rather than theory alone.

---

## Author

**Raju Ahmed**

Software Engineer focused on full-stack development, agentic AI, distributed systems, and cloud-native infrastructure.

GitHub: https://github.com/imraj560
