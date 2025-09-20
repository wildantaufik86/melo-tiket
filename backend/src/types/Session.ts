import mongoose from "mongoose";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}
