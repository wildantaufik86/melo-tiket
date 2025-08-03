import { RequestHandler } from "express";
import mongoose from "mongoose";
import TransactionModel from "../models/TransactionModel";
import { BAD_REQUEST } from "../constants/http";

const MAX_TICKETS_PER_USER = 4;

const validateTicketLimit: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { tickets } = req.body;

    // Hitung total tiket dalam request
    const requestedTickets = tickets.reduce((total: any, ticket: any) => total + ticket.quantity, 0);

    // Cek tiket yang sudah dibeli (pending, review, paid)
    const existingTickets = await TransactionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: { $in: ["pending", "review", "paid"] }
        }
      },
      { $unwind: "$tickets" },
      { $group: { _id: "$userId", totalTickets: { $sum: "$tickets.quantity" } } }
    ]);

    const existingTicketCount = existingTickets.length > 0 ? existingTickets[0].totalTickets : 0;

    if (existingTicketCount + requestedTickets > MAX_TICKETS_PER_USER) {
      res.status(BAD_REQUEST).json({
        message: `Anda sudah membeli ${existingTicketCount} tiket. Batas maksimal adalah ${MAX_TICKETS_PER_USER} tiket per user.`
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateTicketLimit;
