// models/ArchivedTransaction.js
import mongoose, { Document, Schema } from "mongoose";

interface ITicket {
  uniqueTicketId: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  qrCode: string;
  ticketImage: string;
}

export interface IArchivedTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  tickets: ITicket[];
  totalTicket: number;
  totalPrice: number;
  status: "pending" | "paid" | "cancelled";
  transactionMethod: "Online" | "On The Site";
  expiredAt: Date;
  paymentProof?: string;
  archivedAt: Date;
  originalTransactionId: mongoose.Types.ObjectId;
}

const ArchivedTransactionSchema = new Schema<IArchivedTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tickets: [
      {
        uniqueTicketId: { type: Schema.Types.ObjectId, required: true },
        ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
        qrCode: { type: String, required: true },
        ticketImage: { type: String, required: true }
      },
    ],
    totalTicket: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    transactionMethod: {
      type: String,
      enum: ["Online", "On The Site"],
      default: "Online",
    },
    expiredAt: { type: Date, required: true },
    paymentProof: { type: String },
    archivedAt: { type: Date, default: Date.now },
    originalTransactionId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

const ArchivedTransactionModel = mongoose.model<IArchivedTransaction>("ArchivedTransaction", ArchivedTransactionSchema);
export default ArchivedTransactionModel;
