import { Request, RequestHandler, Response } from "express";
import UserModel from "../models/UserModel";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import { hashValue } from "../utils/bcrypt";
import mongoose from "mongoose";
import TransactionModel from "../models/TransactionModel";
import AppErrorCode from "../constants/appErrorCode";
import { z } from "zod";
import appAssert from "../utils/appAssert";
import TicketModel from "../models/TicketModel";
// import PDFDocument from "pdfkit";

// Ambil semua transaksi
// Modifikasi pada transaction.controller.js

export const getAllTransactions: RequestHandler = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page as string);
    let limit = parseInt(req.query.limit as string);
    const status = req.query.status as string;
    let search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder as string;
    const ticketId = req.query.ticketId as string; // Parameter ticketId
    const gender = req.query.gender as string; // Parameter gender baru

    page = (!isNaN(page) && page > 0) ? page : 1;
    limit = (!isNaN(limit) && limit > 0) ? limit : 10;

    const skip = (page - 1) * limit;

    let filter: any = {}; // Filter status "paid"
    let sort: any = {};

    if (status) { // Tambahkan status ke filter jika ada
      filter.status = status;
    }

    if (ticketId) {
      filter['tickets.ticketId'] = ticketId; // Filter berdasarkan ticketId
    }

    // Filter untuk gender
    if (gender && ['male', 'female'].includes(gender.toLowerCase())) {
      // Pertama, dapatkan user IDs berdasarkan gender
      const usersByGender = await UserModel.find({
        'profile.gender': gender.toLowerCase()
      }).select('_id');

      const userIds = usersByGender.map(user => user._id);

      // Tambahkan filter untuk userId yang sesuai dengan gender
      filter.userId = { $in: userIds };
    }

    if (search) {
      console.log("Search parameter:", search);
      search = search.trim();

      const matchingUsers = await UserModel.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchingUsers.map((user) => user._id);

      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search);
      const isNumericSearch = !isNaN(Number(search));

      if (userIds.length > 0) {
        filter.$or = [
          ...(isValidObjectId ? [{ _id: search }] : []),
          { userId: { $in: userIds } },
          { transactionMethod: { $regex: search, $options: "i" } },
          ...(isNumericSearch ? [{ totalPrice: Number(search) }] : []),
        ];
      } else {
        filter.$or = [
          ...(isValidObjectId ? [{ _id: search }] : []),
          { transactionMethod: { $regex: search, $options: "i" } },
          ...(isNumericSearch ? [{ totalPrice: Number(search) }] : []),
        ];
      }
    }

    console.log("Filter created:", filter);

    // Handle sortBy and sortOrder
    if (sortBy) {
      const validSortFields = ["createdAt", "userId.name", "transactionMethod", "totalPrice", "paymentProof", "fullname"];
      if (validSortFields.includes(sortBy)) {
        if (sortBy === "fullname") {
          // Sort berdasarkan fullname
          sort["userId.profile.fullname"] = sortOrder === "asc" ? 1 : -1;
        } else {
          sort[sortBy] = sortOrder === "asc" ? 1 : -1;
        }
      } else {
        sort["createdAt"] = -1; // Default sort
      }
    } else {
      sort["createdAt"] = -1; // Default sort
    }

    const totalDocs = await TransactionModel.countDocuments(filter);

    const transactions = await TransactionModel.find(filter)
      .populate({
        path: "userId",
        select: "name email createdAt paymentProof profile",
        populate: {
          path: "profile",
          select: "fullname gender phoneNumber", // Tambahkan gender ke select
        },
      })
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Transactions Retrieved Successfully",
      data: transactions,
      pagination: {
        total: totalDocs,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalDocs / limit),
      },
    });
  } catch (error) {
    console.error("Error in getAllTransactions:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export const updateTransactionStatus:RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi input
    appAssert(
      id,
      NOT_FOUND,
      "Transaction ID is required",
    );
    appAssert(
      status,
      NOT_FOUND,
      "Status is required",
    );

    // Temukan transaksi berdasarkan ID
    const transaction = await TransactionModel.findById(id);

    // Pastikan transaksi ditemukan
    appAssert(
      transaction,
      NOT_FOUND,
      "Transaction not found",
      AppErrorCode.ResourcesNotFound
    );

    // Perbarui status transaksi
    transaction.status = status;
    await transaction.save();

    // Kirim respons sukses
    res.status(200).json({
      message: "Transaction status updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    next(error);
  }
};

export const getAllTickets: RequestHandler = async (req, res, next) => {
  try {
    const transactions = await TicketModel.find();
    res.status(OK).json({
      message: "Data Retrieved Successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
}


export const getAllTransactionsByUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    appAssert(mongoose.Types.ObjectId.isValid(id), NOT_FOUND, "Invalid User ID");

    const transactions = await TransactionModel.find({ userId: id }).populate("userId", "name email");

    if (!transactions.length) {
      res.status(NOT_FOUND).json({ message: "No transactions found for this user." });
    }

    res.status(OK).json({
      message: "Transaction history retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const printTicketHandler: RequestHandler = async (req, res, next) => {
  // try {
  //   const { transactionId } = req.params;

  //   appAssert(mongoose.Types.ObjectId.isValid(transactionId), NOT_FOUND, "Invalid Transaction ID");

  //   // Populate transaksi dengan informasi user
  //   const transaction = await TransactionModel.findById(transactionId)
  //     .populate<{ userId: { name: string; email: string } }>("userId", "name email")
  //     .lean(); // ✅ Gunakan lean() agar hasilnya berupa plain object, bukan mongoose document

  //   appAssert(transaction, NOT_FOUND, "Transaction not found");

  //   // ✅ Pastikan `amount` ada dalam transaction
  //   if (!("amount" in transaction)) {
  //     res.status(NOT_FOUND).json({ message: "Transaction does not contain amount data" });
  //   }

  //   // ✅ Pastikan `userId` mengandung objek user (bukan ObjectId)
  //   const user = transaction.userId;
  //   appAssert(user && "name" in user && "email" in user, NOT_FOUND, "User data is missing");

  //   // Generate PDF tiket
  //   const doc = new PDFDocument();
  //   res.setHeader("Content-Disposition", `attachment; filename=ticket-${transactionId}.pdf`);
  //   res.setHeader("Content-Type", "application/pdf");

  //   doc.pipe(res);
  //   doc.fontSize(20).text("E-Ticket", { align: "center" });
  //   doc.moveDown();
  //   doc.fontSize(16).text(`Transaction ID: ${transaction._id}`);
  //   doc.text(`User: ${user.name} (${user.email})`);
  //   doc.text(`Status: ${transaction.status}`);
  //   doc.text(`Amount: ${transaction.amount}`); // ✅ Pastikan `amount` ada sebelum ditampilkan
  //   doc.moveDown();
  //   doc.text("Thank you for your purchase!", { align: "center" });

  //   doc.end();
  // } catch (error) {
  //   next(error);
  // }
};

export const updateUserProfile: RequestHandler = async (req: any, res: any) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid user ID format" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    // Update user fields
    if (updateData.email) user.email = updateData.email;
    if (updateData.name) user.name = updateData.name;
    if (updateData.role) user.role = updateData.role;

    // Update profile fields
    if (updateData.profile) {
      // Initialize profile with an empty object if it doesn't exist
      if (!user.profile) {
        // Use type assertion to define the profile structure
        user.profile = {
          picture: '',
          idNumber: '',
          fullname: '',
          gender: '',
          phoneNumber: '',
          dateOfBirth: ''
        };
      }

      // Now TypeScript knows user.profile exists and has the right structure
      if (updateData.profile.picture !== undefined) user.profile.picture = updateData.profile.picture;
      if (updateData.profile.fullname !== undefined) user.profile.fullname = updateData.profile.fullname;
      if (updateData.profile.gender !== undefined) user.profile.gender = updateData.profile.gender;
      if (updateData.profile.phoneNumber !== undefined) user.profile.phoneNumber = updateData.profile.phoneNumber;
      if (updateData.profile.dateOfBirth !== undefined) user.profile.dateOfBirth = updateData.profile.dateOfBirth;
    }

    await user.save();

    res.status(OK).json({
      message: "User profile updated successfully",
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while updating user profile",
      error: (error as Error).message
    });
  }
};

export const changeUserPassword: RequestHandler = async (req: any, res: any) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid user ID format" });
    }

    if (!newPassword) {
      return res.status(BAD_REQUEST).json({ message: "New password is required" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    // Hash the password before saving (assuming your schema has a pre-save hook)
    // If not, you should hash it explicitly here
    user.password = newPassword;
    await user.save();

    res.status(OK).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while changing password",
      error: (error as Error).message
    });
  }
};



// Schema validasi input
const updateStatusSchema = z.object({
  status: z.enum(["pending", "paid", "reject"]),
});

// Handler untuk update status transaksi
// export const updateTransactionStatusHandler: RequestHandler = async (req, res, next) => {
//   try {
//     const { transactionId } = req.params;
//     const { status } = updateStatusSchema.parse(req.body);

//     // Cek apakah transactionId valid
//     appAssert(mongoose.Types.ObjectId.isValid(transactionId), BAD_REQUEST, "Invalid transaction ID", AppErrorCode.InvalidTransactionId);

//     // Cari transaksi di database
//     const transaction = await TransactionModel.findById(transactionId);
//     appAssert(transaction, NOT_FOUND, "Transaction not found", AppErrorCode.TransactionNotFound);

//     // Update status transaksi
//     transaction.status = status;
//     await transaction.save();

//      res.status(OK).json({
//       message: "Transaction status updated successfully",
//       data: transaction,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
