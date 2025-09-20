import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import mongoose from "mongoose";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "../constants/http";
import { IEvent } from "../types/Event";
import { ITicket } from "../types/Ticket";
import { ITransaction } from "../types/Transaction";

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
    const { name, email, role, profile, password } = req.body;

    if(!email || !password) {
      return res.status(BAD_REQUEST).json({message: "Email and password are required",});
    }

    const existingUser = await UserModel.findOne({email});
    if(existingUser) {
      return res.status(BAD_REQUEST).json({message: "Email already exists"});
    }

    const newUser = await UserModel.create({name, email, role, profile, password});
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
