import { Router } from "express";
import { changeMyPasswordHandler, getMyProfileHandler, updateMyProfileHandler } from "../controllers/profile.controller";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";

const profileRoutes = Router();

profileRoutes.get("/", authenticate, getMyProfileHandler);
profileRoutes.patch("/update", authenticate, updateMyProfileHandler);
profileRoutes.patch("/update-password", changeMyPasswordHandler);

export default profileRoutes;
