import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createTransactionHandler, getAllTransactionsHandler, getTransactionByIdHandler, softDeleteTransactionHandler, verifyTransactionHandler } from "../controllers/transaction.controller";
import createUploader from "../middleware/upload";

const transactionRoutes = Router()

const uploadPaymentProof = createUploader("paymentProof");

transactionRoutes.post("/", authenticate, uploadPaymentProof.single('paymentProof'), createTransactionHandler)
transactionRoutes.get( "/", authenticate, getAllTransactionsHandler);
transactionRoutes.get("/:transactionId", authenticate, getTransactionByIdHandler);
transactionRoutes.patch("/:transactionId/verify", authenticate, verifyTransactionHandler);
transactionRoutes.delete("/:transactionId", authenticate, softDeleteTransactionHandler);

export default transactionRoutes;
