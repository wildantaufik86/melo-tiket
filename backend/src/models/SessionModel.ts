import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";
import { SessionDocument } from "../types/Session";

const sessionSchema = new mongoose.Schema<SessionDocument>({
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  userAgent: { type: String },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: thirtyDaysFromNow,
  },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);
export default SessionModel;
