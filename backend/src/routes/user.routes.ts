import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import {  createTransactionHandler } from "../controllers/transaction.controller";
import upload from "../middleware/upload";
import { createUserHandler, deleteUserHandler, getAllUserHandler, getUserByIdHandler, searchUsersHandler, softDeleteUserHandler, updateUserProfileHandler } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", authenticate, validateRole("admin", "superadmin"), getAllUserHandler)
userRoutes.get('/search', authenticate, validateRole("admin", "superadmin"), searchUsersHandler);
userRoutes.get("/:id", authenticate, getUserByIdHandler)
userRoutes.post("/create", authenticate, validateRole("admin", "superadmin"), createUserHandler)
userRoutes.patch("/:id", authenticate, validateRole("superadmin"), updateUserProfileHandler)
userRoutes.delete("/:id", authenticate, validateRole("superadmin"), softDeleteUserHandler)

export default userRoutes;
