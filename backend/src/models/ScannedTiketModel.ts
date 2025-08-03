import mongoose, { Schema, Document } from 'mongoose';

interface ScannedTicket extends Document {
  uniqueTicketId: mongoose.Types.ObjectId;
  transactionId: mongoose.Types.ObjectId; // Referensi ke transaksi asal
  qrCodeData: string; // Data QR code yang dipindai
  scanTime: Date;
  transaction?: any;
  scannedByOperatorId?: mongoose.Types.ObjectId;
}

const ScannedTicketSchema: Schema = new Schema({
  uniqueTicketId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Transaction', index: true },
  qrCodeData: { type: String, required: true, index: true },
  scanTime: { type: Date, default: Date.now, index: true },
  scannedByOperatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const ScannedTicketModel = mongoose.model<ScannedTicket>('ScannedTicket', ScannedTicketSchema);

export default ScannedTicketModel;
export { ScannedTicket };
