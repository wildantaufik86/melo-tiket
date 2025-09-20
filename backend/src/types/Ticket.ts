import mongoose from "mongoose";

export enum TicketStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
  SOLD_OUT = "Sold Out",
}

export interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  category: string;
  price: number;
  stock: number;
  status: TicketStatus;
  templateImage: string;
  templateLayout: string;
}
