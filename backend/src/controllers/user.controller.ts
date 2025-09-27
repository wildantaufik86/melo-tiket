import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import mongoose from "mongoose";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "../constants/http";
import { IEvent } from "../types/Event";
import { ITicket } from "../types/Ticket";
import { ITransaction } from "../types/Transaction";
import appAssert from "../utils/appAssert";
import TransactionModel from "../models/TransactionModel";
import TicketModel from "../models/TicketModel";

type PopulatedTicket = {
  ticketId: {
    _id: mongoose.Types.ObjectId;
    eventId: IEvent;
  } & ITicket;
} & ITransaction['tickets'][number];

type PopulatedTransaction = {
  tickets: PopulatedTicket[];
} & ITransaction;

export const getAllUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Query
    const [users, totalUsers] = await Promise.all([
      UserModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
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
        }),
      UserModel.countDocuments({}),
    ]);

    const processedUsers = users.map((user) => {
      const eventsMap = new Map<string, IEvent & { transactions: PopulatedTransaction[] }>();

      user.historyTransaction?.forEach((transaction) => {
        const populatedTransaction = transaction as unknown as PopulatedTransaction;
        const event = populatedTransaction.tickets[0]?.ticketId?.eventId;
        if (!event) return;
        const eventId = event._id.toString();

        if (!eventsMap.has(eventId)) {
          eventsMap.set(eventId, {
            ...(event as IEvent).toObject(),
            transactions: [],
          });
        }
        eventsMap.get(eventId)?.transactions.push(populatedTransaction);
      });

      const historyByEvent = Array.from(eventsMap.values());
      const { historyTransaction, ...finalUserData } = user.omitPassword();

      return {
        user: finalUserData,
        historyByEvent: historyByEvent,
      };
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(OK).json({
      message: "Data Successfully Retrieved",
      data: processedUsers,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalUsers: totalUsers,
        limit: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id).populate({
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
      return res.status(404).json({ message: "User not found" });
    }

    const eventsMap = new Map<string, IEvent & { transactions: PopulatedTransaction[] }>();

    user.historyTransaction?.forEach((transaction) => {
      const populatedTransaction = transaction as unknown as PopulatedTransaction;
      const event = populatedTransaction.tickets[0]?.ticketId?.eventId;

      if (!event) return;

      const eventId = event._id.toString();

      if (!eventsMap.has(eventId)) {
        eventsMap.set(eventId, {
          ...(event as IEvent).toObject(),
          transactions: [],
        });
      }

      eventsMap.get(eventId)?.transactions.push(populatedTransaction);
    });

    const historyByEvent = Array.from(eventsMap.values());

    const userData = user.omitPassword();
    const { historyTransaction, ...finalUserData } = userData;

    return res.status(OK).json({
      message: "Data retrieved successfully",
      data: {
        user: finalUserData,
        historyByEvent: historyByEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.role !== 'superadmin') {
      return res.status(FORBIDDEN).json({ message: "Access denied. Super admin only." });
    }

    const { id } = req.params;
    const updateData = req.body;

    delete updateData.password;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {$set: updateData},
      {new: true, runValidators: true}
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    res.status(OK).json({
      message: "User profile updated successfully",
      data: updatedUser.omitPassword()
    });
  } catch (error) {
    next(error)
  }
}

export const createUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, role, profile, idNumber, password } = req.body;

    if(!email || !password) {
      return res.status(BAD_REQUEST).json({message: "Email and password are required",});
    }

    if(!idNumber) {
      res.status(BAD_REQUEST).json({message: "ID Number is Required!"})
      return;
    }

    if(idNumber.length !== 16 || !/^\d+$/.test(idNumber)) {
      res.status(BAD_REQUEST).json({message: "Invalid ID Number. It must be exactly 16 digits and contain only numbers."})
      return;
    }

    const existingUser = await UserModel.findOne({email});
    if(existingUser) {
      return res.status(BAD_REQUEST).json({message: "Email already exists"});
    }

    const newUser = await UserModel.create({name, email, role, profile, idNumber, password});
    res.status(201).json({
      message: "User created successfully with profile data",
      data: newUser.omitPassword(),
    });
    console.log("New User Created: ", newUser)
    console.log("Created by: ", req.user)
  } catch (error) {
    next(error)
  }
}

export const deleteUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteTicket = await UserModel.findByIdAndDelete(id);

    if(!deleteTicket) {
      return res.status(NOT_FOUND).json({message: "User not found"});
    }

    res.status(OK).json({
      message: "User deleted successfully",
      data: deleteTicket.omitPassword(),
    })
    console.log("User deleted:", deleteTicket, "Deleted by :", req.user)
  } catch (error) {
    next(error)
  }
}

// src/controllers/user.controller.ts

export const softDeleteUserHandler: RequestHandler = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).session(session);

    appAssert(user, NOT_FOUND, "User not found");
    appAssert(user.deletedAt === null, BAD_REQUEST, "User has already been deleted.");

    const pendingTransactions = await TransactionModel.find({
      userId: user._id,
      status: 'pending'
    }).session(session);

    for (const transaction of pendingTransactions) {
      // Langkah 1: Hitung semua stok yang perlu dikembalikan per transaksi
      const stockToReturn = new Map<string, number>();

      for (const purchasedTicket of transaction.tickets) {
        const ticketId = purchasedTicket.ticketId.toString();
        stockToReturn.set(ticketId, (stockToReturn.get(ticketId) || 0) + 1);
      }

      // Langkah 2: Jalankan update stok
      const updatePromises = [];
      for (const [ticketId, quantity] of stockToReturn.entries()) {
        updatePromises.push(
          TicketModel.findByIdAndUpdate(
            ticketId,
            { $inc: { stock: quantity } }, // Kembalikan stok sesuai jumlah
            { session }
          )
        );
      }
      await Promise.all(updatePromises);

      // Ubah status transaksi menjadi 'reject'
      transaction.status = 'reject';
      await transaction.save({ session });
    }

    user.deletedAt = new Date();
    await user.save({ session });

    await session.commitTransaction();

    res.status(OK).json({
      message: "User soft-deleted successfully, and all pending transactions have been cancelled.",
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const searchUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const query = req.query.q as string || '';

    const users = await UserModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      deletedAt: null
    }).select('_id name email').limit(10);

    res.status(OK).json({
      message: "Users found successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
