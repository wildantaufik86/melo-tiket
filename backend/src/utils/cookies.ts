import { CookieOptions, Response } from "express";
import { oneHourFromNow, thirtyDaysFromNow } from "./date";

export const REFRESH_PATH = "/auth/refresh";
const secure = process.env.NODE_ENV !== "Development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: oneHourFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh",
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

// Di dalam file utils/cookies.js (atau di mana pun fungsi ini berada)

export const clearAuthCookies = (res: any) => {
  // Menghapus accessToken
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Pastikan sama dengan saat set
    sameSite: "strict",
    expires: new Date(0), // Mengatur tanggal kedaluwarsa ke masa lalu
    path: "/", // PENTING: Path harus sama persis dengan saat cookie di-set
  });

  // Menghapus refreshToken
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Pastikan sama dengan saat set
    sameSite: "strict",
    expires: new Date(0), // Mengatur tanggal kedaluwarsa ke masa lalu
    path: "/", // PENTING: Path harus sama persis dengan saat cookie di-set
  });

  // Mengembalikan `res` agar bisa di-chain dengan .status().json()
  return res;
};
