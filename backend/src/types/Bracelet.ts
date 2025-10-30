import mongoose from "mongoose";

export interface IBracelet extends Document {
  uniqueId: string;
  scannedAt: Date;
  operatorId: mongoose.Schema.Types.ObjectId;
  eventName: string;
}
