import { Router } from "express";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";
import { createEventHandler, deleteEventHandler, getAllEventsHandler, getEventByIdHandler, updateEventHandler } from "../controllers/event.controller";
import { addTicketTypeToEventHandler, updateTicketTypeHandler } from "../controllers/ticket.controller";


const eventRoutes = Router();

eventRoutes.get("/", getAllEventsHandler);
eventRoutes.get("/:eventId", getEventByIdHandler);
eventRoutes.post("/create", authenticate, createEventHandler);
eventRoutes.patch("/:eventId", authenticate, updateEventHandler);
eventRoutes.delete("/:eventId", authenticate, deleteEventHandler);

eventRoutes.post("/:eventId/tickets", authenticate, addTicketTypeToEventHandler);
eventRoutes.patch("/:eventId/tickets/:ticketId", authenticate, updateTicketTypeHandler);
export default eventRoutes;
