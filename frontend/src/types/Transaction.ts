import { IUser } from './User';

export interface IPurchasedTicket {
  _id?: string;
  ticketId?: string;
  qrCode: string;
  ticketImage: string;
  isScanned: boolean;
  quantity?: number;
  price?: number;
  scannedBy?: string;
  scannedAt?: Date;
}

export interface IRevertTransactionPayload {
  status: 'paid'; // untuk sekarang cuma boleh revert jadi paid
}

export interface ITransaction extends Document {
  _id?: string;
  userId?: string | IUser;
  tickets: IPurchasedTicket[];
  isComplimentary: boolean;
  totalTicket: number;
  totalPrice: number;
  status: 'refund' | 'expired' | 'reject' | 'pending' | 'paid';
  transactionMethod: 'Online' | 'Onsite';
  expiredAt: string;
  paymentProof?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: Date;
}

export interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  limit: number;
}
