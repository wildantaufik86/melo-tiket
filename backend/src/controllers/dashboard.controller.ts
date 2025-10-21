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

    // Transactions summary (exclude complimentary)
    const [
      totalTransactions,
      paidTransactions,
      pendingTransactions,
      rejectedTransactions,
      expiredTransactions,
    ] = await Promise.all([
      TransactionModel.countDocuments({ deletedAt: null, isComplimentary: { $ne: true } }),
      TransactionModel.countDocuments({ status: "paid", deletedAt: null, isComplimentary: { $ne: true } }),
      TransactionModel.countDocuments({ status: "pending", deletedAt: null, isComplimentary: { $ne: true } }),
      TransactionModel.countDocuments({ status: "reject", deletedAt: null, isComplimentary: { $ne: true } }),
      TransactionModel.countDocuments({ status: "expired", deletedAt: null, isComplimentary: { $ne: true } }),
    ]);

    // Revenue (exclude complimentary)
    const revenueAgg = await TransactionModel.aggregate([
      { $match: { status: "paid", deletedAt: null, isComplimentary: { $ne: true } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const expectedRevenueAgg = await TransactionModel.aggregate([
      { $match: { deletedAt: null, isComplimentary: { $ne: true } } },
      { $group: { _id: null, expectedTotalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const expectedTotalRevenue = expectedRevenueAgg.length > 0 ? expectedRevenueAgg[0].expectedTotalRevenue : 0;

    // Ticket stock per category
    const stockPerCategory = await TicketModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$category",
          categoryName: { $first: "$categoryInfo.name" },
          totalStock: { $sum: "$stock" }
        }
      }
    ]);

    // Ticket sold per category (exclude complimentary)
    const soldPerCategory = await TransactionModel.aggregate([
      { $match: { status: "paid", deletedAt: null, isComplimentary: { $ne: true } } },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },

      { $unwind: "$tickets" },
      {
        $lookup: {
          from: "tickets",
          localField: "tickets.ticketId",
          foreignField: "_id",
          as: "ticketInfo"
        }
      },
      { $unwind: { path: "$ticketInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "ticketInfo.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: "$ticketInfo.category",
          categoryName: { $first: "$categoryInfo.name" },
          totalSold: { $sum: 1 },
          totalRevenue: { $sum: "$ticketInfo.price" },
          male: {
            $sum: {
              $cond: [{ $eq: ["$userInfo.profile.gender", "male"] }, 1, 0]
            }
          },
          female: {
            $sum: {
              $cond: [{ $eq: ["$userInfo.profile.gender", "female"] }, 1, 0]
            }
          },
          totalCount: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$userInfo.profile.gender", "male"] },
                    { $eq: ["$userInfo.profile.gender", "female"] }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          }
        }
      }
    ]);

    // Transaction per category (exclude complimentary)
    const transactionPerCategory = await TransactionModel.aggregate([
      { $match: { deletedAt: null, isComplimentary: { $ne: true } } },
      { $unwind: "$tickets" },
      {
        $lookup: {
          from: "tickets",
          localField: "tickets.ticketId",
          foreignField: "_id",
          as: "ticketInfo"
        }
      },
      { $unwind: { path: "$ticketInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "ticketInfo.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$ticketInfo.category",
          categoryName: { $first: "$categoryInfo.name" },
          totalAmount: { $sum: "$ticketInfo.price" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const totalStock = stockPerCategory.reduce((sum, category) => sum + category.totalStock, 0);
    const totalSold = soldPerCategory.reduce((sum, category) => sum + category.totalSold, 0);
    const totalSoldRevenue = soldPerCategory.reduce((sum, category) => sum + category.totalRevenue, 0);
    const totalTransactionAmount = transactionPerCategory.reduce((sum, category) => sum + category.totalAmount, 0);
    const totalCategoryTransactions = transactionPerCategory.reduce((sum, category) => sum + category.totalTransactions, 0);

    res.status(OK).json({
      message: "Dashboard summary retrieved successfully",
      data: {
        users: { total: totalUsers, male: maleUsers, female: femaleUsers },
        events: totalEvents,
        tickets: {
          total: totalTickets,
          totalStock,
          totalSold,
          totalSoldRevenue,
          stockPerCategory,
          soldPerCategory
        },
        transactions: {
          total: totalTransactions,
          paid: paidTransactions,
          pending: pendingTransactions,
          rejected: rejectedTransactions,
          expired: expiredTransactions,
          totalTransactionAmount,
          totalCategoryTransactions,
          perCategory: transactionPerCategory,
        },
        expectedTotalRevenue,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
