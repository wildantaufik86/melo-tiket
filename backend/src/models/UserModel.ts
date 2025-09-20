import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import { UserDocument } from "../types/User";

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
      fullname: { type: String, default: "" },
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
    historyTransaction: [{
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }],
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
  const { password, ...userObject } = this.toObject();
  return userObject;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
