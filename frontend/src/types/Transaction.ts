import { IUser } from "./User";

export interface IPurchasedTicket {
  _id?: string;
  ticketId?: string;
  qrCode: string;
  ticketImage: string;
  isScanned: boolean;
}

export interface ITransaction extends Document {
  _id?: string;
  userId?: string | IUser;
  tickets: IPurchasedTicket[];
  totalTicket: number;
  totalPrice: number;
  status: "expired" | "reject" | "pending" | "paid";
  transactionMethod: "Online" | "Onsite";
  expiredAt: string;
  paymentProof?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  deletedAt?: string;
  createdAt?: string;
}

export interface IPaginationInfo {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    limit: number;
}
