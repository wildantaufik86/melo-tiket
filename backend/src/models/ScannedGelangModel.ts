import mongoose, { Schema, Document } from 'mongoose';

interface ScannedGelang extends Document {
  barcode: string;
  scanTime: Date;
  // Anda bisa menambahkan field lain jika diperlukan,
  // misalnya ID operator yang melakukan scan.
  scannedByOperatorId?: mongoose.Types.ObjectId;
}

const ScannedGelangSchema: Schema = new Schema({
  barcode: { type: String, required: true, unique: true, index: true }, // Unique agar tidak bisa di-scan dua kali
  scanTime: { type: Date, default: Date.now, index: true },
  scannedByOperatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const ScannedGelangModel = mongoose.model<ScannedGelang>('ScannedGelang', ScannedGelangSchema);

export default ScannedGelangModel;
export { ScannedGelang };
