import mongoose, { Schema, Document } from 'mongoose';
import { IBracelet } from '../types/Bracelet';

const BraceletSchema: Schema = new Schema({
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventName: {
    type: String,
    required: true,
    default: 'melofestvol2',
  },
});

const BraceletModel = mongoose.model<IBracelet>(
  'Bracelet',
  BraceletSchema
);

export default BraceletModel;
