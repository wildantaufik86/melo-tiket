import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import {  createTransactionHandler, createTransactionPresale2Handler, createTransactionPresale3Handler, createTransactionPresale4Handler, getUserTransactions, updateTransactionUserHandler, uploadProofHandler } from "../controllers/transaction.controller";
import upload from "../middleware/upload";
import { createUserHandler, deleteUserHandler, getAllUserHandler, getUserByIdHandler, updateUserProfileHandler } from "../controllers/user.controller";

const userRoutes = Router();


userRoutes.post("/transactions/buy", authenticate, validateRole("user"), createTransactionHandler);
userRoutes.post("/transactions2/buy", authenticate, validateRole("user"), createTransactionPresale2Handler);
userRoutes.post("/transactions3/buy", authenticate, validateRole("user"), createTransactionPresale3Handler);
userRoutes.post("/transactions4/buy", authenticate, validateRole("user"), createTransactionPresale4Handler);
userRoutes.post("/transactions/:transactionId/proof", authenticate, upload.single("paymentProof"), uploadProofHandler);
// userRoutes.put("/transaction/pre-create", preCreateTranscationHandler);
userRoutes.get("/transactions", authenticate, validateRole("user"), getUserTransactions); // Fixed order
userRoutes.put("/transactions/:id", authenticate, validateRole("user"), upload.single("paymentProof"), updateTransactionUserHandler);


userRoutes.get("/", authenticate, validateRole("superadmin"), getAllUserHandler)
userRoutes.get("/:id", authenticate, validateRole("superadmin"), getUserByIdHandler)
userRoutes.post("/create", authenticate, validateRole("superadmin"), createUserHandler)
userRoutes.patch("/:id", authenticate, validateRole("superadmin"), updateUserProfileHandler)
userRoutes.delete("/:id", authenticate, validateRole("superadmin"), deleteUserHandler)

export default userRoutes;
