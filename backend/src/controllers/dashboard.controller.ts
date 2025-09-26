import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import EventModel from "../models/EventModel";
import TicketModel from "../models/TicketModel";
import TransactionModel from "../models/TransactionModel";
import { OK } from "../constants/http";

export const getDashboardSummaryHandler: RequestHandler = async (req, res, next) => {
  try {
    const totalUsers = await UserModel.countDocuments({ deletedAt: null });

    const [maleUsers, femaleUsers] = await Promise.all([
      UserModel.countDocuments({ "profile.gender": "male", deletedAt: null }),
      UserModel.countDocuments({ "profile.gender": "female", deletedAt: null }),
    ]);

    const [totalEvents, totalTickets] = await Promise.all([
      EventModel.countDocuments({ deletedAt: null }),
      TicketModel.countDocuments({}),
    ]);

    const [
      totalTransactions,
      paidTransactions,
      pendingTransactions,
      rejectedTransactions,
      expiredTransactions,
    ] = await Promise.all([
      TransactionModel.countDocuments({ deletedAt: null }),
      TransactionModel.countDocuments({ status: "paid", deletedAt: null }),
      TransactionModel.countDocuments({ status: "pending", deletedAt: null }),
      TransactionModel.countDocuments({ status: "reject", deletedAt: null }),
      TransactionModel.countDocuments({ status: "expired", deletedAt: null }),
    ]);

    const revenueAgg = await TransactionModel.aggregate([
      { $match: { status: "paid", deletedAt: null } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Ticket stock per category - dengan lookup
    const stockPerCategory = await TicketModel.aggregate([
      {
        $lookup: {
          from: "categories", // nama collection Category (biasanya plural)
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$category",
          categoryName: { $first: "$categoryInfo.name" },
          totalStock: { $sum: "$stock" }
        }
      }
    ]);

    // Ticket sold per category - dengan lookup yang lebih complex
    const soldPerCategory = await TransactionModel.aggregate([
      { $match: { status: "paid", deletedAt: null } },
      { $unwind: "$tickets" },
      {
        $lookup: {
          from: "tickets",
          localField: "tickets.ticketId",
          foreignField: "_id",
          as: "ticketInfo"
        }
      },
      {
        $unwind: {
          path: "$ticketInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "ticketInfo.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$ticketInfo.category",
          categoryName: { $first: "$categoryInfo.name" },
          totalSold: { $sum: 1 }, // setiap ticket yang terjual
          totalRevenue: { $sum: "$ticketInfo.price" }
        }
      }
    ]);

    // Transaction per category - dengan lookup
    const transactionPerCategory = await TransactionModel.aggregate([
      { $match: { deletedAt: null } },
      { $unwind: "$tickets" },
      {
        $lookup: {
          from: "tickets",
          localField: "tickets.ticketId",
          foreignField: "_id",
          as: "ticketInfo"
        }
      },
      {
        $unwind: {
          path: "$ticketInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "ticketInfo.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$ticketInfo.category",
          categoryName: { $first: "$categoryInfo.name" },
          totalAmount: { $sum: "$ticketInfo.price" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    res.status(OK).json({
      message: "Dashboard summary retrieved successfully",
      data: {
        users: { total: totalUsers, male: maleUsers, female: femaleUsers },
        events: totalEvents,
        tickets: { total: totalTickets, stockPerCategory, soldPerCategory },
        transactions: {
          total: totalTransactions,
          paid: paidTransactions,
          pending: pendingTransactions,
          rejected: rejectedTransactions,
          expired: expiredTransactions,
          perCategory: transactionPerCategory,
        },
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
