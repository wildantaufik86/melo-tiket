import mongoose from "mongoose";

interface UserPayload {
  _id: mongoose.Types.ObjectId | string;
  email: string;
  role: 'user' | 'operator' | 'admin' | 'superadmin';
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
