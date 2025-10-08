import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { verifyToken } from "../utils/jwt";
import mongoose from "mongoose";
import UserModel from "../models/UserModel";
import SessionModel from "../models/SessionModel";

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
      "Tidak ada izin: Token tidak ditemukan, silahkan Login kembali",
      AppErrorCode.InvalidAccessToken
    );

    // Verifikasi token
    const { error, payload } = verifyToken(accessToken);
    appAssert(
      payload,
      UNAUTHORIZED,
      error === "jwt expired" ? "Token sudah kadaluwarsa, silahkan Login kembali" : "Token tidak valid, silahkan Login kembali",
      AppErrorCode.InvalidAccessToken
    );

    // Validasi payload userId dan sessionId
    const { userId, sessionId } = payload;

    // ← TAMBAHKAN: Validasi sessionId format
    if (typeof userId !== "string" || typeof sessionId !== "string") {
      appAssert(
        false,
        UNAUTHORIZED,
        "Token payload tidak valid, silahkan login kembali",
        AppErrorCode.InvalidAccessToken
      );
    }

    // ← PENTING: Cek apakah session masih ada dan valid di database
    const session = await SessionModel.findById(sessionId);
    appAssert(
      session,
      UNAUTHORIZED,
      "Sesi tidak ditemukan, silahkan login kembali",
      AppErrorCode.InvalidAccessToken
    );

    appAssert(
      session.expiresAt.getTime() > Date.now(),
      UNAUTHORIZED,
      "Sesi telah habis, silahkan login kembali",
      AppErrorCode.InvalidAccessToken
    );

    // Validasi user masih ada
    const userFromDb = await UserModel.findById(userId).select('_id role email');
    appAssert(
      userFromDb,
      UNAUTHORIZED,
      "Pengguna tidak ditemukan",
      AppErrorCode.InvalidAccessToken
    );

    // Set user info ke request
    req.user = {
      _id: userFromDb._id as mongoose.Types.ObjectId,
      role: userFromDb.role!,
      email: userFromDb.email
    };

    try {
      req.userId = new mongoose.Types.ObjectId(userId);
      req.sessionId = new mongoose.Types.ObjectId(sessionId);
    } catch (err) {
      appAssert(
        false,
        UNAUTHORIZED,
        "Invalid ObjectId format in token payload",
        AppErrorCode.InvalidAccessToken
      );
    }

    // Jika semua valid, lanjut ke route berikutnya
    next();
  } catch (error: unknown) {
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
