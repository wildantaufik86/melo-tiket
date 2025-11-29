import mongoose from "mongoose";

export interface IPurchasedTicket {
  _id: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  qrCode: string;
  ticketImage: string;
  isScanned: boolean;
  quantity?: number;
  price?: number;
  scannedBy?: mongoose.Types.ObjectId | string;
  scannedAt?: Date;
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  tickets: IPurchasedTicket[];
  totalTicket: number;
  totalPrice: number;
  status: "refund" | "expired" | "reject" | "pending" | "paid";
  transactionMethod: "Online" | "Onsite";
  isComplimentary?: boolean,
  expiredAt: Date;
  paymentProof?: string;
  verifiedBy?: mongoose.Types.ObjectId | string;
  verifiedAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}
