// Import semua yang dibutuhkan dari express
import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import { OK, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } from "../constants/http"; // Pastikan INTERNAL_SERVER_ERROR adalah angka (e.g., 500)

export const getMyProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    res.status(OK).json({
      message: "User profile retrieved successfully",
      data: user.omitPassword(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { name, profile} = req.body;

    const allowedUpdate = { name, profile };

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: allowedUpdate }, // '$set' hanya akan update field yang ada di 'updateData'
      { new: true, runValidators: true } // 'new: true' mengembalikan dokumen setelah di-update
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: "User profile not found" });
    }

    res.status(OK).json({
      message: "Profile updated successfully",
      data: updatedUser.omitPassword(),
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while updating the profile",
      error: (error as Error).message,
    });
  }
};

export const changeMyPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

    if(!currentPassword || !newPassword || !newPasswordConfirmation) {
      return res.status(BAD_REQUEST).json({
        message: "All fields are required",
      })
    }
    if(newPassword !== newPasswordConfirmation) {
      return res.status(BAD_REQUEST).json({
        message: "New Password and confirmation do not match",
      })
    }
    // if(newPassword.length > 6) {
    //   return res.status(BAD_REQUEST).json({
    //     message: "Password must be at least 8 characters",
    //   })
    // }

    const user = await UserModel.findById(userId);
    if(!user) {
     return res.status(NOT_FOUND).json({
        message: "User not found"
      })
    }

    const isPasswordCorrect = await user?.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
     return res.status(UNAUTHORIZED).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

   return res.status(OK).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error)
  }
}
