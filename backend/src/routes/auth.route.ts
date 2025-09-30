import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller";
import authLimiter from "../utils/rateLimiter";

const authRoutes = Router();
authRoutes.post("/register", authLimiter, registerHandler);
authRoutes.post("/login", authLimiter, loginHandler);
authRoutes.post("/logout", authLimiter, logoutHandler);
authRoutes.get("/refresh", authLimiter, refreshHandler);

export default authRoutes;
