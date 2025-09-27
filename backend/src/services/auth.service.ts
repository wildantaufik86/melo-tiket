import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/SessionModel";
import UserModel from "../models/UserModel";
import VerificationCodeModel from "../models/VerificationCodeModel";
import appAssert from "../utils/appAssert";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import jwt from "jsonwebtoken";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";

export type CreateAccountParams = {
  email: string;
  name: string;
  password: string;
  idNumber?: number;
  profile?: {
    picture: string;
    phoneNumber: string;
    fullname: string;
    dateOfBirth: string;
    gender: string;
    address?: {
      street?: string;
      village?: string;
      subDistrict?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  }
  role?: "user" | "operator" | "superadmin" | "admin" | "operator_voucher" | "operator_gelang";
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // Verify existing user
  const existingUser = await UserModel.exists({ email: data.email
  });
  appAssert(!existingUser, CONFLICT, "Email already in use");

  // Create user
  const user = await UserModel.create({
    email: data.email,
    name: data.name,
    idNumber: data.idNumber || null,
    profile: {
      picture: data.profile?.picture || "",
      fullname: data.name,
      phoneNumber: data.profile?.phoneNumber || "",
      gender: data.profile?.gender || "",
      dateOfBirth: data.profile?.dateOfBirth || "",
      address: data.profile?.address || {
        street: "",
        village: "",
        subDistrict: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    },
    password: data.password,
    role: data.role || "user",
  });
  const userId = user._id;

  // verification code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // create session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    userId,
    sessionId: session._id,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // get user by Email
  const user = await UserModel.findOne({ email: email });
  appAssert(user, UNAUTHORIZED, "Invalid Email or Password");

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid Email or Password");

  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    userId,
    ...sessionInfo,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // refresh the session if it expires in the next 24hrs
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};
