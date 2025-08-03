import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  profile?: {
    picture: string;
    phoneNumber: string;
    idNumber: string;
    dateOfBirth: string;
    fullname: string;
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
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    "_id" | "email" | "name" | "profile" | "role" | "createdAt" | "updatedAt"
  >;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    profile: {
      picture: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
      idNumber: { type: String, default: "" },
      dateOfBirth: { type: String, default: "" },
      gender: { type: String, default: "" },
      address: {
        street: { type: String, default: ""  },
        village: { type: String, default: ""  },
        subDistrict: { type: String, default: ""  },
        city: { type: String, default: ""  },
        state: { type: String, default: ""  },
        postalCode: { type: String, default: ""  },
        country: { type: String, default: ""  },
      },
    },
    historyTransaction: {
      type: [Schema.Types.ObjectId],
      ref: "Transaction",
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
