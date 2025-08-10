import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import {
  changeUserPassword,
  getAllTickets,
  getAllTransactions,
  getAllTransactionsByUser,
  printTicketHandler,
  updateUserProfile,
} from "../controllers/admin.controller";
import { createTicketHandler, updateTicketHandler } from "../controllers/ticket.controller";
import upload from "../middleware/upload";
import { createAdminTransactionHandler, createAdminTransactionHandler2, createAdminTransactionHandler3, createAdminTransactionHandler4, createTransactionHandler, exportAllTransactions, getAllArchivedTransactions, restoreArchivedTransaction, uploadProofHandler } from "../controllers/transaction.controller";
import { generateMultipleQRCodesHandler } from "../controllers/qr.controller";

const adminRoutes = Router();
// adminRoutes.get("/transactions", authenticate, validateRole("superadmin"), getAllTransactions);
adminRoutes.get("/transactions/user/:id", authenticate, validateRole("superadmin"), getAllTransactionsByUser);
adminRoutes.get("/tickets/print/:transactionId", authenticate, validateRole("superadmin"), printTicketHandler);
adminRoutes.post("/users/:id/edit", authenticate, validateRole('superadmin'), updateUserProfile);
adminRoutes.post("/users/:id/change-password", authenticate, validateRole('superadmin'), changeUserPassword);
// adminRoutes.post("/tickets", authenticate, validateRole('superadmin'), createTicketHandler);
// adminRoutes.get("/tickets/all", authenticate, validateRole('superadmin'), getAllTickets);
adminRoutes.put("/tickets/:ticketId", authenticate, validateRole("superadmin"), upload.array("images", 5), updateTicketHandler);

adminRoutes.post("/transactions/create", authenticate, validateRole("superadmin", "operator"),  createAdminTransactionHandler);
adminRoutes.post("/transactions/create-presale-2", authenticate, validateRole("superadmin", "operator"),  createAdminTransactionHandler2);
adminRoutes.post("/transactions/create-presale-3", authenticate, validateRole("superadmin", "operator"),  createAdminTransactionHandler3);
adminRoutes.post("/transactions/create-presale-4", authenticate, validateRole("superadmin", "operator"),  createAdminTransactionHandler4);
adminRoutes.post("/transactions/:transactionId/proof", authenticate, validateRole("superadmin", "operator"), upload.single("paymentProof"), uploadProofHandler)

adminRoutes.get("/transactions/archieved", authenticate, validateRole("superadmin"), getAllArchivedTransactions);
adminRoutes.post("/transactions/:transactionId/restore", restoreArchivedTransaction);
adminRoutes.get('/transactions/archieved/export', exportAllTransactions);

adminRoutes.post("/qr/generate-multiple", authenticate, validateRole("superadmin"), generateMultipleQRCodesHandler);

export default adminRoutes;
