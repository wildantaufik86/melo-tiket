import mongoose, { Schema } from 'mongoose';

interface IQrCount extends mongoose.Document {
  lastQrIdCounter: number;
}

const QrCountSchema: Schema = new Schema({
  lastQrIdCounter: { type: Number, default: 0 },
});

export default mongoose.model<IQrCount>('QrCounter', QrCountSchema);
