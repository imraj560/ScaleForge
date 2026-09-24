
import type { Request, Response, NextFunction } from "express";
import {
  httpRequestsTotal,
  httpRequestDuration,
} from "../metrics.js";

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration =
      Number(process.hrtime.bigint() - start) / 1e9;

    const route = req.route?.path
      ? `${req.baseUrl}${req.route.path}`
      : req.path;

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });

  next();
}