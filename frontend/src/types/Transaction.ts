import { IUser } from "./User";

export interface IPurchasedTicket {
  _id?: string;
  ticketId?: string;
  qrCode: string;
  ticketImage: string;
  isScanned: boolean;
}

export interface ITransaction extends Document {
  userId?: string | IUser;
  tickets: IPurchasedTicket[];
  totalTicket: number;
  totalPrice: number;
  status: "reject" | "pending" | "paid";
  transactionMethod: "Online" | "Onsite";
  expiredAt: Date;
  paymentProof?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  deletedAt?: Date;
}
