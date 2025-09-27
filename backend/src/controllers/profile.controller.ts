// Import semua yang dibutuhkan dari express
import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import { OK, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } from "../constants/http"; // Pastikan INTERNAL_SERVER_ERROR adalah angka (e.g., 500)

export const getMyProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(UNAUTHORIZED).json({ message: "Authentication required" });
    }

    const user = await UserModel.findById(userId).populate({
      path: "historyTransaction",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "tickets.ticketId",
        model: "Ticket",
        select: "category price eventId",
        populate: {
          path: "eventId",
          model: "Event",
          select: "eventName date address headlineImage",
        },
      },
    });

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    const eventsMap = new Map<string, any>();

    user.historyTransaction?.forEach((transaction) => {
      const populatedTransaction = transaction as any;
      const event = populatedTransaction.tickets[0]?.ticketId?.eventId;

      if (!event) return;
      const eventId = event._id.toString();

      if (!eventsMap.has(eventId)) {
        eventsMap.set(eventId, {
          ...(event as any).toObject(),
          transactions: [],
        });
      }

      eventsMap.get(eventId)?.transactions.push(populatedTransaction);
    });

    const historyByEvent = Array.from(eventsMap.values());

    const userData = user.omitPassword();
    const { historyTransaction, ...finalUserData } = userData;

    return res.status(OK).json({
      message: "User profile retrieved successfully",
      data: {
        user: finalUserData,
        historyByEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { idNumber } = req.body;

    if (!userId) {
      return res.status(UNAUTHORIZED).json({ message: "Authentication required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    // Pastikan field counter ada di schema user
    if (!user.idNumberChangeCount) {
      user.idNumberChangeCount = 0;
    }

    if (user.idNumberChangeCount >= 2) {
      return res.status(BAD_REQUEST).json({
        message: "You have reached the maximum of 2 changes for ID Number",
      });
    }

    if (!idNumber) {
      return res.status(BAD_REQUEST).json({
        message: "idNumber is required",
      });
    }

    user.idNumber = idNumber;
    user.idNumberChangeCount += 1;
    await user.save();

    return res.status(OK).json({
      message: "ID Number updated successfully",
      data: user.omitPassword(),
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while updating the profile",
      error: (error as Error).message,
    });
  }
};

export const forgotPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, idNumber, newPassword, newPasswordConfirmation } = req.body || {};
    const parsedIdNumber = idNumber ? Number(idNumber): undefined;

    if (!email || !newPassword || !newPasswordConfirmation) {
      return res.status(BAD_REQUEST).json({
        message: "Email, new password and confirmation are required",
      });
    }

    if (newPassword !== newPasswordConfirmation) {
      return res.status(BAD_REQUEST).json({
        message: "New Password and confirmation do not match",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    // Kalau user punya idNumber → wajib cocok
    if (user.idNumber && user.idNumber !== parsedIdNumber) {
      return res.status(UNAUTHORIZED).json({
        message: "ID Number does not match our records",
      });
    }

    // Kalau user.idNumber ada tapi request kosong
    if (user.idNumber && !idNumber) {
      return res.status(BAD_REQUEST).json({
        message: "ID Number is required for this account",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(OK).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
