import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";

const validateRole = (...requiredRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      // console.log("Validating role for userId:", req.userId);

      // Ambil user berdasarkan req.userId
      const user = await UserModel.findById(req.userId);

      appAssert(
        user, // Pastikan user ditemukan
        UNAUTHORIZED,
        "Access denied: User not found",
        AppErrorCode.InvalidRole
      );

      const isRoleValid = user.role !== undefined && requiredRoles.includes(user.role);

      appAssert(
        isRoleValid, // Validasi role
        UNAUTHORIZED,
        `Access denied: User role is '${user.role}', required role is '${requiredRoles.join(", ")}'`,
        AppErrorCode.InvalidRole
      );

      next();
    } catch (error) {
      console.error("Error validating role:", error);
      // Panggil next dengan error untuk melanjutkan ke error-handling middleware
      next(error);
    }
  };
};

export default validateRole;
