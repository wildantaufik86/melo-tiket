import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createTransactionHandler, exportAllTransactionsHandler, generateQrCodeHandler, getAllTransactionsHandler, getTransactionByIdHandler, refundTransactionStatusHandler, regenerateTransactionHandler, revertTicketScanHandler, revertTransactionStatusHandler, revertWristbandScanHandler, softDeleteTransactionHandler, updatePaymentProofHandler, updateTransactionStatusHandler, verifyETicketHandler, verifyTransactionHandler, verifyWristbandQrHandler } from "../controllers/transaction.controller";
import createUploader from "../middleware/upload";

const transactionRoutes = Router()

const uploadPaymentProof = createUploader("paymentProof");

transactionRoutes.post("/", authenticate, uploadPaymentProof.single('paymentProof'), validateRole("user", "admin", "superadmin"), createTransactionHandler)
transactionRoutes.get( "/", authenticate, validateRole("operator", "admin", "superadmin"), getAllTransactionsHandler);
transactionRoutes.get("/:transactionId", authenticate, validateRole("operator", "admin", "superadmin"), getTransactionByIdHandler);
transactionRoutes.patch("/:transactionId/status", authenticate, validateRole("superadmin"), updateTransactionStatusHandler);
transactionRoutes.patch( "/:transactionId/revert", authenticate, validateRole("superadmin"), revertTransactionStatusHandler);
transactionRoutes.patch( "/:transactionId/refund", authenticate, validateRole("superadmin", "admin"), refundTransactionStatusHandler);

transactionRoutes.patch("/:transactionId/verify", authenticate, validateRole("admin", "superadmin", "operator"), verifyTransactionHandler);
transactionRoutes.delete("/:transactionId", authenticate, validateRole("superadmin"), softDeleteTransactionHandler);
transactionRoutes.get("/export/all", authenticate, validateRole("superadmin"), exportAllTransactionsHandler);
transactionRoutes.post("/:transactionId/regenerate", authenticate, validateRole("superadmin", "admin"), regenerateTransactionHandler)
transactionRoutes.patch("/:id/payment-proof", authenticate, validateRole("admin", "superadmin"), uploadPaymentProof.single("paymentProof"), updatePaymentProofHandler);

transactionRoutes.post("/qr/generate", authenticate, validateRole("superadmin"), generateQrCodeHandler);
transactionRoutes.post("/qr/verify-wristband", authenticate, validateRole("admin", "superadmin"), verifyWristbandQrHandler);
transactionRoutes.post("/qr/reverse-wristband", authenticate, validateRole("admin", "superadmin"), revertWristbandScanHandler);
transactionRoutes.post("/qr/verify-eticket", authenticate, validateRole("admin", "superadmin"), verifyETicketHandler);
transactionRoutes.post("/qr/reverse-eticket", authenticate, validateRole("superadmin"), revertTicketScanHandler);
export default transactionRoutes;
