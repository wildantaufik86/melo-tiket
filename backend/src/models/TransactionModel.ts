import mongoose, { Schema } from "mongoose";
import { IPurchasedTicket, ITransaction } from "../types/Transaction";

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
      enum: ["expired", "reject", "pending", "paid"],
      default: "pending",
    },
    transactionMethod: {
      type: String,
      enum: ["Online", "Onsite"],
      default: "Online",
    },
    expiredAt: { type: Date, required: true },
    paymentProof: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default TransactionModel;
