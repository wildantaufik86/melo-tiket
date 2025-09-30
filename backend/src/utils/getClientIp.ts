import { Request } from "express";

export function getClientIp(req: Request): string {
  const xfwd = req.headers["x-forwarded-for"];

  if (typeof xfwd === "string") {
    return xfwd.split(",")[0].trim();
  } else if (Array.isArray(xfwd)) {
    return xfwd[0];
  }

  return req.ip || "unknown";
}
