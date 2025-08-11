import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createTransactionHandler } from "../controllers/transaction.controller";

const transactionRoutes = Router()

transactionRoutes.post("/", authenticate, validateRole("user"), createTransactionHandler)

export default transactionRoutes;
