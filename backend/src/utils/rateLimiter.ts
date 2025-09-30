import rateLimit from "express-rate-limit";
import { getClientIp } from "./getClientIp";

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: getClientIp,
  message: {
    status: 429,
    error: "Terlalu banyak permintaan",
    message: "Anda telah mencapai batas permintaan untuk endpoint ini. Silakan coba lagi setelah 10 menit.",
  },
  handler: (req, res, next, options) => {
    const ip = getClientIp(req);
    console.warn(`Rate limit terlampaui oleh IP: ${ip} pada endpoint: ${req.path}`);
    res.status(options.statusCode).send(options.message);
  },
});

export default authLimiter;
