// src/models/TransactionModel.ts
import mongoose, { Document, Schema } from "mongoose";

interface IPurchasedTicket {
  _id: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  qrCode: string;
  ticketImage: string;
  isScanned: boolean;
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  tickets: IPurchasedTicket[];
  totalTicket: number;
  totalPrice: number;
  status: "reject" | "pending" | "paid";
  transactionMethod: "Online" | "On Site";
  expiredAt: Date;
  paymentProof?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
}

const PurchasedTicketSchema = new Schema<IPurchasedTicket>({
  ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
  qrCode: { type: String, required: true },
  ticketImage: { type: String, required: true },
  isScanned: { type: Boolean, default: false },
})

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tickets: [PurchasedTicketSchema],
    totalTicket: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["reject", "pending", "paid"],
      default: "pending",
    },
    transactionMethod: {
      type: String,
      enum: ["Online", "On The Site"],
      default: "Online",
    },
    expiredAt: { type: Date, required: true },
    paymentProof: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default TransactionModel;
