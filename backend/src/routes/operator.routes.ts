import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { getAllTransactions, updateTransactionStatus } from "../controllers/admin.controller";
import { archivedTransaction, exportAllTransactions, genderStatsCountHandler, regenerateTicketImagesHandler, regenerateTicketImagesHandler2, regenerateTicketImagesHandler3, regenerateTicketImagesHandler4, restoreArchivedTransaction, statsCountHandler, uploadProofHandler } from "../controllers/transaction.controller";
import upload from "../middleware/upload";
import { deleteScannedTicketGelangHandler, deleteScannedTicketHandler, getGelangStatusHandler, getScannedGelangHandler, getScannedTicketsHandler, getTicketByUniqueIdHandler, refundTicketHandler, scanGelangHandler, scanQRHandler } from "../controllers/qr.controller";

const operatorRoutes = Router();

operatorRoutes.get("/transactions", authenticate, validateRole("superadmin", "operator", "admin"),  getAllTransactions);
operatorRoutes.put("/transactions/:id", authenticate, validateRole("superadmin", "operator"), updateTransactionStatus);
operatorRoutes.delete('/transactions/:transactionId', authenticate, validateRole("superadmin", "operator"), archivedTransaction);
operatorRoutes.put("/transactions/:id/proof", authenticate, upload.single("paymentProof"), validateRole("superadmin", "operator"), uploadProofHandler);
operatorRoutes.post('/transactions/:transactionId/regenerate-tickets', authenticate, validateRole("superadmin", "operator", "admin"), regenerateTicketImagesHandler);
operatorRoutes.post('/transactions/:transactionId/regenerate-tickets-presale2', authenticate, validateRole("superadmin", "operator", "admin"), regenerateTicketImagesHandler2);
operatorRoutes.post('/transactions/:transactionId/regenerate-tickets-presale3', authenticate, validateRole("superadmin", "operator", "admin"), regenerateTicketImagesHandler3);
operatorRoutes.post('/transactions/:transactionId/regenerate-tickets-presale4', authenticate, validateRole("superadmin", "operator", "admin"), regenerateTicketImagesHandler4);
operatorRoutes.get('/transactions/stats', authenticate, validateRole("superadmin", "operator", "admin"), statsCountHandler);
operatorRoutes.get('/transactions/genderStats', authenticate, validateRole("superadmin", "operator", "admin"), genderStatsCountHandler);
operatorRoutes.get('/transactions/export', authenticate, validateRole("superadmin", "operator", "admin"), exportAllTransactions);
operatorRoutes.put('/ticket/refund/:uniqueTicketId', authenticate, validateRole("superadmin"), refundTicketHandler);
operatorRoutes.delete('/scanned-tickets/:uniqueTicketId', authenticate, validateRole("superadmin"), deleteScannedTicketHandler);
operatorRoutes.delete('/scanned-tickets-gelang/:barcode', authenticate, validateRole("superadmin"), deleteScannedTicketGelangHandler);

operatorRoutes.get('/scanned-ticket-voucher', authenticate, validateRole("superadmin", "operator"), getScannedTicketsHandler);
operatorRoutes.get('/scanned-ticket-gelang', authenticate, validateRole("superadmin", "operator"), getScannedGelangHandler);

operatorRoutes.get('/ticket/:uniqueTicketId', authenticate, validateRole("superadmin", "operator_voucher"), getTicketByUniqueIdHandler);
operatorRoutes.post('/ticket/qrscan', authenticate, validateRole("superadmin", "operator_voucher"), scanQRHandler);
operatorRoutes.post('/ticket-gelang/scan',authenticate, validateRole("superadmin", "operator_gelang"), scanGelangHandler); // Rute untuk scan gelang
operatorRoutes.get('/ticket-gelang/:barcode',authenticate, validateRole("superadmin", "operator_gelang"), getGelangStatusHandler);


export default operatorRoutes;
