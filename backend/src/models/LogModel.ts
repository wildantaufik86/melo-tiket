import mongoose, { Schema, Document } from 'mongoose';

// Interface untuk mendefinisikan tipe data Log
interface Log extends Document {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  resourceType?: string; // Opsional: Jenis sumber daya yang terkait (misalnya, 'transaction', 'user')
  resourceId?: mongoose.Types.ObjectId | string; // Opsional: ID sumber daya yang terkait
  actorType?: string; // Opsional: Jenis aktor yang melakukan tindakan (misalnya, 'user', 'system', 'operator')
  actorId?: mongoose.Types.ObjectId | string; // Opsional: ID aktor
  details?: any; // Opsional: Objek yang berisi informasi tambahan
}

// Skema Mongoose untuk Log
const LogSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now, index: true }, // Kapan log dibuat, diindeks untuk pencarian cepat
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'debug'],
    default: 'info',
    index: true, // Diindeks untuk filtering berdasarkan level
  },
  message: { type: String, required: true }, // Pesan log utama yang menjelaskan peristiwa
  resourceType: { type: String, index: true }, // Jenis sumber daya terkait, diindeks untuk pencarian
  resourceId: { type: Schema.Types.Mixed, index: true }, // ID sumber daya terkait (bisa ObjectId atau string), diindeks
  actorType: { type: String, index: true }, // Jenis aktor, diindeks
  actorId: { type: Schema.Types.Mixed, index: true }, // ID aktor, diindeks
  details: { type: Schema.Types.Mixed }, // Informasi tambahan dalam format JSON atau objek
});

// Membuat model Log berdasarkan skema
const LogModel = mongoose.model<Log>('Log', LogSchema);

export default LogModel;
export { Log, LogSchema };
