import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import mongoose from "mongoose";
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "../constants/http";
import { NodeXHR } from "socket.io-client";
import TicketModel from "../models/TicketModel";

export const getAllUserHandler: RequestHandler = async (req, res) => {
  try {
    const users = await UserModel.find(
      {},
      "_id email profile role historyTransaction"
    );
    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const validTransactions = await UserModel.find({
          _id: { $in: user.historyTransaction },
        });

        const validTransactionIds = validTransactions.map((t) => t._id as mongoose.Types.ObjectId);
        if (validTransactionIds.length !== user.historyTransaction?.length) {
          user.historyTransaction = validTransactionIds;
          await user.save();
        }
        return {
          id: user._id,
          profile: user.profile,
          email: user.email,
          role: user.role,
          historyTransaction: validTransactionIds,
        };
      })
    );

    return res.status(OK).json({
      message: "Data Successfully Retrieved",
      data: formattedUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
}

export const getUserByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(OK).json({
      message: "Data retrieved Successfully",
      data: user.omitPassword()
    })
  } catch (error) {
    next(error)
  }
}

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
