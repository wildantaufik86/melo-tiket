import mongoose from "mongoose";
import { RequestHandler } from "express";
import TransactionModel from "../models/TransactionModel";
import TicketModel from "../models/TicketModel";
import UserModel from "../models/UserModel";
import { BAD_REQUEST, CREATED, FORBIDDEN, NOT_FOUND } from "../constants/http";
import appAssert from "../utils/appAssert";
import AppError from "../utils/appError";
import { processAndGenerateTicket } from "../services/ticket.service";

export const createTransactionHandler: RequestHandler = async (req, res, next) => {
  // Logika retry dan transaksi Anda sudah sangat baik, kita pertahankan
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const initiator = req.user;
    appAssert(initiator, FORBIDDEN, "Authentication failed, user not found.")
    const { tickets: ticketRequests, transactionMethod, userId: targetUserIdFromAdmin } = req.body; // Divalidasi oleh Zod/Joi

    // 1. Tentukan untuk siapa transaksi ini dibuat
    let targetUserId;

    if (initiator.role === 'user') {
      targetUserId = initiator._id;
    }
    else if (initiator.role === 'superadmin' || initiator.role === 'admin') {
      appAssert(targetUserIdFromAdmin, BAD_REQUEST, "Admin must provide a target userId");
      targetUserId = targetUserIdFromAdmin;
    }
    else {
      throw new AppError(FORBIDDEN, "User role is not permitted to create a transaction.");
    }

    const existingPendingTransaction = await TransactionModel.findOne({
      userId: targetUserId,
      status: 'pending'
    });

    appAssert(
      !existingPendingTransaction,
      BAD_REQUEST, // Status 400
      "You already have a pending transaction. Please complete it first or wait for it to expire."
    );
    // 2. Fetch semua jenis tiket yang diminta dan populate data event-nya
    const ticketIds = ticketRequests.map((t: any) => t.ticketId);
    const ticketsFromDb = await TicketModel.find({ _id: { $in: ticketIds } })
      .populate({ path: 'eventId', select: 'eventName date' }) // Populate data dari EventModel
      .session(session);

    appAssert(ticketsFromDb.length === ticketIds.length, NOT_FOUND, "Some ticket types were not found");

    const ticketMap = new Map(ticketsFromDb.map((t: any) => [t._id.toString(), t]));
    let totalPrice = 0;
    let totalTicket = 0;
    const ticketProcessingPromises = [];

    // 3. Validasi stok, hitung harga, dan siapkan proses pembuatan aset
    for (const request of ticketRequests) {
      const ticketDoc = ticketMap.get(request.ticketId);
      appAssert(ticketDoc, NOT_FOUND, `Ticket type ${request.ticketId} not found`);
      appAssert(ticketDoc.stock >= request.quantity, BAD_REQUEST, `Not enough stock for ${ticketDoc.category}`);
      appAssert(ticketDoc.status === 'Available', BAD_REQUEST, `Ticket ${ticketDoc.category} is currently not available`);

      totalPrice += ticketDoc.price * request.quantity;
      totalTicket += request.quantity;
      ticketDoc.stock -= request.quantity; // Update stok secara lokal

      for (let i = 0; i < request.quantity; i++) {
        // Panggil service untuk tugas berat (Non-Blocking)
        ticketProcessingPromises.push(processAndGenerateTicket(ticketDoc));
      }
    }

    // 4. Jalankan semua pembuatan file (QR & Gambar) secara paralel
    const formattedTickets = await Promise.all(ticketProcessingPromises);

    // 5. Update stok di database
    const stockUpdatePromises = ticketsFromDb.map(t => t.save({ session }));
    await Promise.all(stockUpdatePromises);

    // 6. Buat dokumen transaksi
    const transaction = new TransactionModel({
      userId: targetUserId,
      tickets: formattedTickets,
      totalTicket,
      totalPrice, // Harga AMAN dari server
      status: transactionMethod === 'On The Site' ? 'paid' : 'pending', // Jika OTS, langsung paid
      transactionMethod,
      expiredAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    await transaction.save({ session });

    await UserModel.findByIdAndUpdate(
      targetUserId,
      { $push: { historyTransaction: transaction._id } },
      { session }
    )

    // 7. Commit transaksi
    await session.commitTransaction();

    res.status(CREATED).json({
      message: "Transaction created successfully.",
      transactionId: transaction._id,
      totalPrice: transaction.totalPrice,
      status: transaction.status,
      expiredAt: transaction.expiredAt,
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
