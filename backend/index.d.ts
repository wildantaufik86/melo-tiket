import mongoose from "mongoose";

interface UserPayload {
  _id: mongoose.Types.ObjectId | string;
  role: 'user' | 'admin' | 'superadmin';
}

declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      user?: UserPayload;
      sessionId?: mongoose.Types.ObjectId;
    }
  }
}
export {};
