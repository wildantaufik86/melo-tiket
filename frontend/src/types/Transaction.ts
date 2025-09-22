export interface IPurchasedTicket {
  _id?: string;
  ticketId?: string;
  qrCode: string;
  ticketImage: string;
  isScanned: boolean;
}

export interface ITransaction extends Document {
  userId?: string;
  tickets: IPurchasedTicket[];
  totalTicket: number;
  totalPrice: number;
  status: "reject" | "pending" | "paid";
  transactionMethod: "Online" | "On Site";
  expiredAt: Date;
  paymentProof?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  deletedAt?: Date;
}
