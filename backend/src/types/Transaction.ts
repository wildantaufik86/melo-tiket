import mongoose from "mongoose";

export interface IPurchasedTicket {
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
  transactionMethod: "Online" | "Onsite";
  expiredAt: Date;
  paymentProof?: string;
  verifiedBy?: mongoose.Types.ObjectId | string;
  verifiedAt?: Date;
  deletedAt?: Date;
}
