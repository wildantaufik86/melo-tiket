import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { getDashboardSummaryHandler } from "../controllers/dashboard.controller";

const summaryRoutes = Router();

summaryRoutes.get('/summary', authenticate, getDashboardSummaryHandler)

export default summaryRoutes
