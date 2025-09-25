import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createTransactionHandler, getAllTransactionsHandler, getTransactionByIdHandler, softDeleteTransactionHandler, verifyTransactionHandler } from "../controllers/transaction.controller";
import createUploader from "../middleware/upload";

const transactionRoutes = Router()

const uploadPaymentProof = createUploader("paymentProof");

transactionRoutes.post("/", authenticate, uploadPaymentProof.single('paymentProof'), validateRole("user", "admin", "superadmin"), createTransactionHandler)
transactionRoutes.get( "/", authenticate, validateRole("admin", "superadmin"), getAllTransactionsHandler);
transactionRoutes.get("/:transactionId", authenticate, getTransactionByIdHandler);
transactionRoutes.patch("/:transactionId/verify", authenticate, validateRole("admin", "superadmin"), verifyTransactionHandler);
transactionRoutes.delete("/:transactionId", authenticate, validateRole("superadmin"), softDeleteTransactionHandler);

export default transactionRoutes;
