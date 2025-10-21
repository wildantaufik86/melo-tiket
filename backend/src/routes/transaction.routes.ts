import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createTransactionHandler, exportAllTransactionsHandler, getAllTransactionsHandler, getTransactionByIdHandler, regenerateTransactionHandler, revertTransactionStatusHandler, softDeleteTransactionHandler, updateTransactionStatusHandler, verifyTransactionHandler } from "../controllers/transaction.controller";
import createUploader from "../middleware/upload";

const transactionRoutes = Router()

const uploadPaymentProof = createUploader("paymentProof");

transactionRoutes.post("/", authenticate, uploadPaymentProof.single('paymentProof'), validateRole("user", "admin", "superadmin"), createTransactionHandler)
transactionRoutes.get( "/", authenticate, validateRole("operator", "admin", "superadmin"), getAllTransactionsHandler);
transactionRoutes.get("/:transactionId", authenticate, validateRole("operator", "admin", "superadmin"), getTransactionByIdHandler);
transactionRoutes.patch("/:transactionId/status", authenticate, validateRole("superadmin"), updateTransactionStatusHandler);
transactionRoutes.patch( "/:transactionId/revert", authenticate, validateRole("superadmin"), revertTransactionStatusHandler
);
transactionRoutes.patch("/:transactionId/verify", authenticate, validateRole("admin", "superadmin", "operator"), verifyTransactionHandler);
transactionRoutes.delete("/:transactionId", authenticate, validateRole("superadmin"), softDeleteTransactionHandler);
transactionRoutes.get("/export/all", authenticate, validateRole("superadmin"), exportAllTransactionsHandler);
transactionRoutes.post("/:transactionId/regenerate", authenticate, validateRole("superadmin", "admin"), regenerateTransactionHandler)

export default transactionRoutes;
