import rateLimit from "express-rate-limit";

const getApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Too many request, please wait 10 minutes',
})

export default getApiLimiter;
