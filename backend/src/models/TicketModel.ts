import mongoose, { Schema, Document } from "mongoose";
import { ITicket, TicketStatus } from "../types/Ticket";


const TicketSchema = new Schema<ITicket>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.AVAILABLE,
    },
    templateImage: {
      type: String,
      required: true
    },
    templateLayout: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

TicketSchema.index({ eventId: 1, category: 1 }, { unique: true });

const TicketModel = mongoose.model<ITicket>("Ticket", TicketSchema);

export default TicketModel;
