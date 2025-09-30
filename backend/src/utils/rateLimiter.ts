import rateLimit from "express-rate-limit";
import { getClientIp } from "./getClientIp";

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => {
    // Kalau ada email di body (login/register), jadikan key
    if (req.body?.email) {
      return `user-${req.body.email}`;
    }

    // fallback ke IP asli
    const xfwd = req.headers["x-forwarded-for"];
    if (typeof xfwd === "string") {
      return xfwd.split(",")[0].trim();
    } else if (Array.isArray(xfwd)) {
      return xfwd[0];
    }
    return req.ip || "unknown";
  },
  message: {
    status: 429,
    error: "Terlalu banyak percobaan login",
    message: "Tunggu 10 menit sebelum mencoba lagi."
  }
});


export default authLimiter;
