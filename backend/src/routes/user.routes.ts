import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import {  createTransactionHandler } from "../controllers/transaction.controller";
import upload from "../middleware/upload";
import { createUserHandler, deleteUserHandler, getAllUserHandler, getUserByIdHandler, searchUsersHandler, softDeleteUserHandler, updateUserProfileHandler } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", authenticate, getAllUserHandler)
userRoutes.get('/search', authenticate, searchUsersHandler);
userRoutes.get("/:id", authenticate, getUserByIdHandler)
userRoutes.post("/create", authenticate, createUserHandler)
userRoutes.patch("/:id", authenticate, updateUserProfileHandler)
userRoutes.delete("/:id", authenticate, softDeleteUserHandler)

export default userRoutes;
