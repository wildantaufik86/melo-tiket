import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import {  createTransactionHandler } from "../controllers/transaction.controller";
import upload from "../middleware/upload";
import { createUserHandler, deleteUserHandler, exportAllUsersHandler, getAllUserHandler, getUserByIdHandler, searchUsersHandler, softDeleteUserHandler, updateUserProfileHandler } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", authenticate, validateRole("operator", "admin", "superadmin"), getAllUserHandler)
userRoutes.get('/search', authenticate, validateRole("operator", "admin", "superadmin"), searchUsersHandler);
userRoutes.get("/:id", authenticate, validateRole("operator", "admin", "superadmin"), getUserByIdHandler)
userRoutes.post("/create", authenticate, validateRole("admin", "superadmin"), createUserHandler)
userRoutes.patch("/:id", authenticate, validateRole("superadmin"), updateUserProfileHandler)
userRoutes.delete("/:id", authenticate, validateRole("superadmin"), softDeleteUserHandler)

userRoutes.get("/export/all", authenticate, validateRole("superadmin"), exportAllUsersHandler)

export default userRoutes;
