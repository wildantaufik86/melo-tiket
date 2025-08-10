import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { verifyToken } from "../utils/jwt";
import mongoose from "mongoose";
import UserModel from "../models/UserModel";

const authenticate: RequestHandler = async (req, res, next) => {
  try {
    // Ambil token dari Cookie atau Header Authorization
    const cookieToken = req.cookies?.accessToken as string | undefined;
    const headerToken = req.headers.authorization?.split(" ")[1];
    const accessToken = cookieToken || headerToken;

    // Pastikan token tersedia
    appAssert(
      accessToken,
      UNAUTHORIZED,
      "Not authorized: Token is missing",
      AppErrorCode.InvalidAccessToken
    );

    // Verifikasi token
    const { error, payload } = verifyToken(accessToken);
    appAssert(
      payload,
      UNAUTHORIZED,
      error === "jwt expired" ? "Token expired" : "Invalid token",
      AppErrorCode.InvalidAccessToken
    );

    // Validasi payload userId dan sessionId
    const { userId, sessionId } = payload;
    const userFromDb = await UserModel.findById(userId).select('_id role');

    if (!userFromDb) {
      return res.status(UNAUTHORIZED).json({ message: "User for this token not found" });
    }

    req.user = {
      _id: userFromDb._id as mongoose.Types.ObjectId,
      role: userFromDb.role!
    };

    if (typeof userId === "string" && typeof sessionId === "string") {
      try {
        req.userId = new mongoose.Types.ObjectId(userId);
        req.sessionId = new mongoose.Types.ObjectId(sessionId);
      } catch (err) {
        throw new Error("Invalid ObjectId format in token payload");
      }
    } else {
      appAssert(
        false,
        UNAUTHORIZED,
        "Invalid token payload",
        AppErrorCode.InvalidAccessToken
      );
    }

    // Jika semua valid, lanjut ke route berikutnya
    next();
  } catch (error: unknown) {
    // Pastikan error adalah instance dari Error
    let message = "Authentication failed";
    if (error instanceof Error) {
      message = error.message;
    }

    res.status(UNAUTHORIZED).json({
      message,
      code: AppErrorCode.InvalidAccessToken,
    });
  }
};

export default authenticate;
