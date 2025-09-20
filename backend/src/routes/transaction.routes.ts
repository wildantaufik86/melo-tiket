import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createTransactionHandler, deleteTransactionHandler, getAllTransactionsHandler, getTransactionByIdHandler, softDeleteTransactionHandler, verifyTransactionHandler } from "../controllers/transaction.controller";

const transactionRoutes = Router()

transactionRoutes.post("/", authenticate, validateRole("user", "admin", "superadmin"), createTransactionHandler)
transactionRoutes.get( "/", authenticate, validateRole("admin", "superadmin"), getAllTransactionsHandler);
transactionRoutes.get("/:transactionId", authenticate, getTransactionByIdHandler);
transactionRoutes.patch("/:transactionId/verify", authenticate, validateRole("admin", "superadmin"), verifyTransactionHandler);
transactionRoutes.delete("/:transactionId", authenticate, validateRole("superadmin"), softDeleteTransactionHandler);

export default transactionRoutes;
