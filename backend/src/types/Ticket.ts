import mongoose from "mongoose";
import { ICategory } from "./Category";

export enum TicketStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
  SOLD_OUT = "Sold Out",
}

export interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId | ICategory ;
  price: number;
  stock: number;
  status: TicketStatus;
  templateImage: string;
  templateLayout: string;
}
