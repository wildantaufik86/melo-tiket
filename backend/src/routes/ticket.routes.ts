import { Router } from "express";
import {
  addTicketTypeToEventHandler,
  getAllTicketTypesForEventHandler,
  getTicketTypeByIdHandler,
  updateTicketTypeHandler,
  deleteTicketTypeHandler
} from "../controllers/ticket.controller"; // Asumsi nama controller
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";

const ticketRoutes = Router();

ticketRoutes.get("/:eventId", getAllTicketTypesForEventHandler);
ticketRoutes.get("/:eventId/:ticketId", getTicketTypeByIdHandler);
ticketRoutes.delete("/:ticketId", authenticate, validateRole("superadmin"), deleteTicketTypeHandler);

export default ticketRoutes;
