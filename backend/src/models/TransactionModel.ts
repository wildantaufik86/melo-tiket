// src/models/TransactionModel.ts
import mongoose, { Document, Schema } from "mongoose";

interface ITicket {
  uniqueTicketId: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  qrCode: string;
  ticketImage: string;
  isScanned: boolean;
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  tickets: ITicket[];
  totalTicket: number;
  totalPrice: number;
  status: "reject" | "pending" | "paid"; // Update status enum
  transactionMethod: "Online" | "On The Site";
  expiredAt: Date;
  paymentProof?: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tickets: [
      {
        uniqueTicketId: { type: Schema.Types.ObjectId, required: true },
        ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
        qrCode: { type: String, required: true },
        ticketImage: { type: String, required: true },
        isScanned: { type: Boolean, default: false }
      },
    ],
    totalTicket: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["reject", "pending", "paid"], // Update status enum
      default: "pending",
    },
    transactionMethod: {
      type: String,
      enum: ["Online", "On The Site"],
      default: "Online",
    },
    expiredAt: { type: Date, required: true },
    paymentProof: { type: String },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default TransactionModel;
