import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createTicketHandler, deleteTicketHandler, getAllTicketHandler, getTicketByIdHandler, updateTicketHandler } from "../controllers/ticket.controller";

const ticketRoutes = Router();

ticketRoutes.get("/", authenticate, validateRole("superadmin", "admin"), getAllTicketHandler)
ticketRoutes.get("/:id", authenticate, validateRole("superadmin", "admin"), getTicketByIdHandler)
ticketRoutes.post("/create", authenticate, validateRole("superadmin", "admin"), createTicketHandler)
ticketRoutes.patch("/:id", authenticate, validateRole("superadmin", "admin"), updateTicketHandler)
ticketRoutes.delete("/delete", authenticate, validateRole("superadmin", "admin"), deleteTicketHandler)

export default ticketRoutes;
