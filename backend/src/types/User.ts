import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  idNumber: number;
  idNumberChangeCount: number,
  profile?: {
    picture: string;
    phoneNumber: string;
    dateOfBirth: string;
    fullname?: string;
    gender: string;
    address?: {
      street?: string;
      village?: string;
      subDistrict?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country: string;
    };
  };
  historyTransaction?: mongoose.Types.ObjectId[];
  role?: "user" | "admin" | "superadmin";
  password: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    "_id" | "email" | "name" | "profile" | "role" | "historyTransaction" | "createdAt" | "updatedAt"
  >;
}
