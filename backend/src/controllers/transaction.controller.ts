import mongoose from 'mongoose';
import { Request, RequestHandler } from 'express';
import TransactionModel from '../models/TransactionModel';
import TicketModel from '../models/TicketModel';
import UserModel from '../models/UserModel';
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
} from '../constants/http';
import appAssert from '../utils/appAssert';
import AppError from '../utils/appError';
import { processAndGenerateTicket } from '../services/ticket.service';
import nodeCron from 'node-cron';
import { IPurchasedTicket } from '../types/Transaction';
import fs from "fs";
import path from "path";


const getBaseUrl = (req: Request): string =>
  `${req.protocol}://${req.get('host')}`;

// nodeCron.schedule('*/10 * * * *', async () => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const expiredTransactions = await TransactionModel.find({
//       status: 'pending',
//       expiredAt: { $lt: new Date() },
//     }).session(session);

//     for (const transaction of expiredTransactions) {
//       for (const purchasedTicket of transaction.tickets) {
//         await TicketModel.findByIdAndUpdate(
//           purchasedTicket.ticketId,
//           { $inc: { stock: 1 } },
//           { session }
//         );
//       }

//       // ubah status transaksi jadi expired
//       transaction.status = 'expired';
//       await transaction.save({ session });
//     }

//     await session.commitTransaction();
//   } catch (err) {
//     await session.abortTransaction();
//     console.error('Error expiring transactions:', err);
//   } finally {
//     session.endSession();
//   }
// });

export const createTransactionHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const initiator = req.user;
    appAssert(initiator, FORBIDDEN, 'Authentication failed, user not found.');

    if (initiator.role === 'user') {
      const freshUser = await UserModel.findById(initiator._id).lean();
      appAssert(
        freshUser?.idNumber,
        BAD_REQUEST,
        'Harap isi NIK terlebih dahulu di halaman Profile.'
      );
    }

    // [PERBAIKAN] Ubah isComplimentary dari body menjadi boolean yang sesungguhnya
    // Ini akan menangani nilai string "true", "false", atau undefined dengan benar.
    const isComplimentaryTxn = req.body.isComplimentary === 'true';
    const { transactionMethod, userId: targetUserIdFromAdmin } = req.body;

    // Gunakan variabel boolean yang sudah bersih
    if (isComplimentaryTxn && initiator.role !== 'superadmin') {
      throw new AppError(FORBIDDEN, 'Hanya superadmin yang dapat membuat transaksi komplimen.');
    }

    const totalPriceFromFE = Number(req.body.totalPrice);
    appAssert(
      !isNaN(totalPriceFromFE),
      BAD_REQUEST,
      'totalPrice must be a valid number'
    );

    const ticketRequests = JSON.parse(req.body.tickets);
    let targetUserId;

    if (initiator.role === 'user') {
      targetUserId = initiator._id;
    } else if (initiator.role === 'superadmin' || initiator.role === 'admin') {
      appAssert(
        targetUserIdFromAdmin,
        BAD_REQUEST,
        'Admin must provide a target userId'
      );
      targetUserId = targetUserIdFromAdmin;
    } else {
      throw new AppError(
        FORBIDDEN,
        'User role is not permitted to create a transaction.'
      );
    }

    const existingPendingTransaction = await TransactionModel.findOne({
      userId: targetUserId,
      status: 'pending',
      expiredAt: { $gt: new Date() },
    });

    appAssert(
      !existingPendingTransaction,
      BAD_REQUEST,
      'You already have a pending transaction. Please complete it first or wait for it to expire.'
    );

    const ticketIds = ticketRequests.map((t: any) => t.ticketId);
    const ticketsFromDb = await TicketModel.find({ _id: { $in: ticketIds } })
      .populate({ path: 'eventId', select: 'eventName date' })
      .session(session);

    appAssert(
      ticketsFromDb.length === ticketIds.length,
      NOT_FOUND,
      'Some ticket types were not found'
    );

    const ticketMap = new Map(
      ticketsFromDb.map((t: any) => [t._id.toString(), t])
    );
    let totalTicket = 0;
    const ticketProcessingPromises = [];

    for (const request of ticketRequests) {
      const ticketDoc = ticketMap.get(request.ticketId);
      appAssert(
        ticketDoc,
        NOT_FOUND,
        `Ticket type ${request.ticketId} not found`
      );

      // [PERBAIKAN] Gunakan variabel boolean yang sudah bersih
      if (!isComplimentaryTxn) {
        appAssert(
          ticketDoc.stock >= request.quantity,
          BAD_REQUEST,
          `Not enough stock for ${ticketDoc.category}`
        );
        appAssert(
          ticketDoc.status === 'Available',
          BAD_REQUEST,
          `Ticket ${ticketDoc.category} is currently not available`
        );
        ticketDoc.stock -= request.quantity;
      }

      totalTicket += request.quantity;

      for (let i = 0; i < request.quantity; i++) {
        ticketProcessingPromises.push(processAndGenerateTicket(ticketDoc));
      }
    }

    // [PERBAIKAN] Gunakan variabel boolean yang sudah bersih
    const requiresPaymentProof = transactionMethod === 'Online' && !isComplimentaryTxn;
    if (requiresPaymentProof) {
      appAssert(
        req.file,
        BAD_REQUEST,
        'You have to upload payment proof for this payment method'
      );
    }

    const formattedTickets = await Promise.all(ticketProcessingPromises);
    const baseUrl = getBaseUrl(req);

    let paymentProofPath = null;
    if (req.file) {
      paymentProofPath = `${baseUrl}/uploads/paymentProof/${req.file.filename}`;
    }

    // [PERBAIKAN] Gunakan variabel boolean yang sudah bersih
    if (!isComplimentaryTxn) {
      const stockUpdatePromises = ticketsFromDb.map((t) => t.save({ session }));
      await Promise.all(stockUpdatePromises);
    }

    const transaction = new TransactionModel({
      userId: targetUserId,
      tickets: formattedTickets,
      totalTicket,
      totalPrice: totalPriceFromFE,
      paymentProof: paymentProofPath,
      status: transactionMethod === 'Onsite' ? 'paid' : 'pending',
      transactionMethod,
      // [PERBAIKAN] Gunakan variabel boolean yang sudah bersih
      isComplimentary: isComplimentaryTxn,
      expiredAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
    await transaction.save({ session });

    await UserModel.findByIdAndUpdate(
      targetUserId,
      { $push: { historyTransaction: transaction._id } },
      { session }
    );

    await session.commitTransaction();

    const responseData: any = {
      message: 'Transaction created successfully.',
      transactionId: transaction._id,
      totalPrice: transaction.totalPrice,
      status: transaction.status,
      expiredAt: transaction.expiredAt,
    };

    if (paymentProofPath) {
      responseData.paymentProof = paymentProofPath;
    }

    res.status(CREATED).json(responseData);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getAllTransactionsHandler: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userRole = req.user?.role;

    const status = req.query.status as string | undefined;
    const searchQuery = req.query.q as string | undefined;

    const match: any = { deletedAt: null };

    if (status && status !== "all") {
      match.status = status;
    }

    if (userRole === 'admin' || userRole === 'operator') {
      match.isComplimentary = { $ne: true };
    }

    const pipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: match },
    ];

    if (searchQuery) {
      const searchConditions: any[] = [
        { "user.name": { $regex: searchQuery, $options: "i" } },
        { "user.email": { $regex: searchQuery, $options: "i" } },
      ];

      if (mongoose.Types.ObjectId.isValid(searchQuery)) {
        searchConditions.push({ _id: new mongoose.Types.ObjectId(searchQuery) });
      }

      const searchNumber = parseFloat(searchQuery);
      if (!isNaN(searchNumber)) {
        searchConditions.push({ totalPrice: searchNumber });
      }

      pipeline.push({ $match: { $or: searchConditions } });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    // ✅ project di sini, sebelum facet
    pipeline.push({
      $project: {
        _id: 1,
        tickets: 1,
        totalTicket: 1,
        totalPrice: 1,
        paymentProof: 1,
        status: 1,
        transactionMethod: 1,
        expiredAt: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
        verifiedBy: 1,
        verifiedAt: 1,
        userId: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
        },
      },
    });

    pipeline.push({
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        total: [{ $count: "count" }],
      },
    });

    const result = await TransactionModel.aggregate(pipeline);

    const transactions = result[0]?.data || [];
    const totalTransactions = result[0]?.total[0]?.count || 0;
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(OK).json({
      message: "Transactions retrieved successfully",
      data: transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionByIdHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { transactionId } = req.params;
    const user = req.user;
    appAssert(user, FORBIDDEN, 'Authentication failed, user not found.');
    const transaction = await TransactionModel.findById(transactionId)
      .populate({ path: 'userId', select: 'name email profile' })
      .populate({ path: 'verifiedBy', select: 'name' })
      .populate({
        path: 'tickets.ticketId',
        select: 'category price eventId quantity',
        populate: {
          path: 'eventId',
          model: 'Event',
          select: 'eventName date',
        },
      });

    appAssert(transaction, NOT_FOUND, 'Transaction not found');

    if ((user.role === 'admin' || user.role === 'operator') && transaction.isComplimentary) {
      throw new AppError(FORBIDDEN, 'You are not authorized to view this transaction');
    }

    if (
      user.role === 'user' &&
      transaction.userId._id.toString() !== user._id.toString()
    ) {
      throw new AppError(
        FORBIDDEN,
        'You are not authorized to view this transaction'
      );
    }

    if (
      transaction.status === 'pending' &&
      transaction.expiredAt < new Date()
    ) {
      transaction.status = 'expired';
      await transaction.save();
    }
    res.status(OK).json({
      message: 'Transaction details retrieved successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyTransactionHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;
    const { status } = req.body;
    const admin = req.user;
    appAssert(admin, FORBIDDEN, 'Authentication failed, admin not found.');

    appAssert(
      status === 'paid' || status === 'reject' || status === 'expired',
      BAD_REQUEST,
      "Invalid status. Must be 'paid' or 'reject'."
    );

    const transaction = await TransactionModel.findById(transactionId).session(
      session
    );
    appAssert(transaction, NOT_FOUND, 'Transaction not found');
    appAssert(
      transaction.status === 'pending',
      BAD_REQUEST,
      'This transaction has already been processed.'
    );

    transaction.status = status;
    transaction.verifiedBy = admin._id;
    transaction.verifiedAt = new Date();

    if (status === 'reject') {
      for (const purchasedTicket of transaction.tickets) {
        await TicketModel.findByIdAndUpdate(
          purchasedTicket.ticketId,
          { $inc: { stock: 1 } },
          { session }
        );
      }
    }

    await transaction.save({ session });
    await session.commitTransaction();

    res.status(OK).json({
      message: `Transaction has been successfully ${status}.`,
      data: transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const softDeleteTransactionHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;

    const transaction = await TransactionModel.findById(transactionId).session(
      session
    );

    appAssert(transaction, NOT_FOUND, 'Transaction not found');
    appAssert(
      transaction.deletedAt === null,
      BAD_REQUEST,
      'This transaction has already been deleted.'
    );

    if (transaction.status !== 'paid') {
      for (const purchasedTicket of transaction.tickets) {
        await TicketModel.findByIdAndUpdate(
          purchasedTicket.ticketId,
          { $inc: { stock: 1 } },
          { session }
        );
      }
    }

    transaction.deletedAt = new Date();
    await transaction.save({ session });

    // Hapus referensi dari riwayat user
    await UserModel.findByIdAndUpdate(
      transaction.userId,
      { $pull: { historyTransaction: transaction._id } },
      { session }
    );

    await session.commitTransaction();

    res.status(OK).json({
      message: 'Transaction has been successfully soft-deleted.',
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const exportAllTransactionsHandler: RequestHandler = async (req, res, next) => {
  try {
    const status = req.query.status as string | undefined;
    const searchQuery = req.query.q as string | undefined;

    const match: any = { deletedAt: null, isComplimentary: { $ne: true } };

    if (status && status !== "all") {
      match.status = status;
    }

    const pipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: match },
    ];

    if (searchQuery) {
      const searchConditions: any[] = [
        { "user.name": { $regex: searchQuery, $options: "i" } },
        { "user.email": { $regex: searchQuery, $options: "i" } },
      ];
      if (mongoose.Types.ObjectId.isValid(searchQuery)) {
        searchConditions.push({ _id: new mongoose.Types.ObjectId(searchQuery) });
      }
      const searchNumber = parseFloat(searchQuery);
      if (!isNaN(searchNumber)) {
        searchConditions.push({ totalPrice: searchNumber });
      }
      pipeline.push({ $match: { $or: searchConditions } });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    // Project untuk memilih field yang akan diekspor
    pipeline.push({
      $project: {
        _id: 0, // Hilangkan _id agar tidak muncul di Excel jika tidak perlu
        "Nama Pembeli": "$user.name",
        "Email": "$user.email",
        "Nomor Hp": "$user.phone", // PASTIKAN NAMA FIELD DI MODEL USER ADALAH 'phone'
        "Jumlah Tiket": "$totalTicket",
        "Total Bayar": "$totalPrice",
        "Status": "$status",
        "Metode": "$transactionMethod",
        "Tanggal Pembelian": "$createdAt",
      },
    });

    const transactions = await TransactionModel.aggregate(pipeline);

    res.status(OK).json({
      status: "success",
      message: "Transactions retrieved successfully for export",
      data: transactions,
    });

  } catch (error) {
    next(error);
  }
};


export const revertTransactionStatusHandler: RequestHandler = async (req: any, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;
    const superAdminId = req.user?._id; // dari JWT

    // ambil transaksi
    const transaction = await TransactionModel.findById(transactionId).session(session);
    appAssert(transaction, 404, "Transaksi tidak ditemukan");

    // hanya boleh revert kalau status reject/expired
    if (!["reject", "expired"].includes(transaction.status)) {
      throw new Error(`Transaksi dengan status ${transaction.status} tidak bisa di-revert`);
    }

    // validasi stok
    for (const item of transaction.tickets) {
      const ticket = await TicketModel.findById(item.ticketId).session(session);
      if (!ticket) throw new Error(`Tiket tidak ditemukan`);
      // stok tidak boleh minus
      if (ticket.stock < 1) {
        throw new Error(`Stok tiket habis, tidak bisa revert`);
      }
    }

    // potong ulang stok sesuai jumlah tiket yang ada di transaksi
    for (const item of transaction.tickets) {
      await TicketModel.findByIdAndUpdate(
        item.ticketId,
        { $inc: { stock: -1 } }, // karena tiap `tickets` sudah represent 1 tiket
        { session }
      );
    }

    // update transaksi jadi paid
    transaction.status = "paid";

    await transaction.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Transaksi berhasil di-revert ke status PAID",
      data: transaction,
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

export const updateTransactionStatusHandler: RequestHandler = async (req: any, res, next) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;
    const superAdminId = req.user?._id;

    // validasi status
    if (!["paid", "pending"].includes(status)) {
      throw new AppError(400, "Status hanya boleh 'paid' atau 'pending'");
    }

    const transaction = await TransactionModel.findById(transactionId);
    appAssert(transaction, 404, "Transaksi tidak ditemukan");

    // jika status yang diubah sama dengan status sekarang, skip
    if (transaction.status === status) {
      throw new AppError(400, `Transaksi sudah memiliki status '${status}'`);
    }

    // update status
    transaction.status = status;
    transaction.verifiedBy = superAdminId;
    transaction.verifiedAt = new Date();

    await transaction.save();

    res.status(200).json({
      success: true,
      message: `Transaksi berhasil diubah menjadi '${status}'`,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

export const regenerateTransactionHandler: RequestHandler = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const initiator = req.user;
    appAssert(initiator, FORBIDDEN, "Authentication failed, user not found.");

    // Hanya admin/superadmin yang boleh regenerate tiket
    if (initiator.role !== "superadmin" && initiator.role !== "admin") {
      throw new AppError(FORBIDDEN, "Only admin or superadmin can regenerate tickets.");
    }

    const { transactionId } = req.params;
    appAssert(transactionId, BAD_REQUEST, "Transaction ID is required.");

    const transaction = await TransactionModel.findById(transactionId).session(session);
    appAssert(transaction, NOT_FOUND, "Transaction not found.");

    const ticketIds = transaction.tickets.map((t) => t.ticketId);
    const ticketsFromDb = await TicketModel.find({ _id: { $in: ticketIds } })
      .populate({ path: "eventId", select: "eventName date" })
      .session(session);

    if (ticketsFromDb.length < ticketIds.length) {
      console.warn(`⚠️ Some ticket types not found in TicketModel for ${transactionId}.`);
    }

    const regeneratedTickets: IPurchasedTicket[] = [];

    for (const oldTicket of transaction.tickets) {
      const ticketDoc = ticketsFromDb.find(
        (t) => t._id.toString() === oldTicket.ticketId.toString()
      );
      if (!ticketDoc) {
        console.warn(`⚠️ Ticket ${oldTicket.ticketId} not found. Skipped.`);
        continue;
      }

      // --- Cek apakah file tiket lama masih ada ---
      const ticketPath = path.join(
        process.cwd(),
        "uploads/tickets",
        path.basename(oldTicket.ticketImage || "")
      );

      const fileExists = oldTicket.ticketImage && fs.existsSync(ticketPath);

      if (!fileExists) {
        console.log(`🛠 Regenerating missing ticket image for ${oldTicket.ticketId}...`);
        const newTicketData = await processAndGenerateTicket(ticketDoc);

        regeneratedTickets.push({
          _id: new mongoose.Types.ObjectId(),
          ticketId: ticketDoc._id,
          qrCode: newTicketData.qrCode,
          ticketImage: newTicketData.ticketImage,
          isScanned: false,
          quantity: oldTicket.quantity ?? 1,
          price: oldTicket.price ?? ticketDoc.price,
        });
      } else {
        // Kalau file masih ada, pakai data lama
        regeneratedTickets.push(oldTicket);
      }
    }

    appAssert(
      regeneratedTickets.length > 0,
      NOT_FOUND,
      "No valid tickets found to regenerate."
    );

    transaction.tickets = regeneratedTickets;
    transaction.updatedAt = new Date();

    await transaction.save({ session });

    await UserModel.findByIdAndUpdate(
      transaction.userId,
      { $addToSet: { historyTransaction: transaction._id } },
      { session }
    );

    await session.commitTransaction();

    res.status(OK).json({
      message: "Tickets regenerated successfully (missing files recreated).",
      transactionId: transaction._id,
      regeneratedTickets: regeneratedTickets.length,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
