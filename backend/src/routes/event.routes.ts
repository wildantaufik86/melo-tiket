import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createEventHandler, deleteEventHandler, getAllEventsHandler, getEventByIdHandler, updateEventHandler } from "../controllers/event.controller";
import { addTicketTypeToEventHandler, updateTicketTypeHandler } from "../controllers/ticket.controller";


const eventRoutes = Router();

eventRoutes.get("/", getAllEventsHandler);
eventRoutes.get("/:eventId", getEventByIdHandler);
eventRoutes.post("/create", authenticate, validateRole("superadmin", "admin"), createEventHandler);
eventRoutes.patch("/:eventId", authenticate, validateRole("superadmin", "admin"), updateEventHandler);
eventRoutes.delete("/:eventId", authenticate, validateRole("superadmin"), deleteEventHandler);

eventRoutes.post("/:eventId/tickets", authenticate, validateRole("superadmin"), addTicketTypeToEventHandler);
eventRoutes.patch("/:eventId/tickets/:ticketId", authenticate, validateRole("superadmin"), updateTicketTypeHandler);
export default eventRoutes;
