import { Router } from "express";
import { forgotPasswordHandler, getMyProfileHandler, updateMyProfileHandler } from "../controllers/profile.controller";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";

const profileRoutes = Router();

profileRoutes.get("/", authenticate, getMyProfileHandler);
profileRoutes.patch("/update", authenticate, updateMyProfileHandler);
profileRoutes.patch("/forgot-password", forgotPasswordHandler);

export default profileRoutes;
