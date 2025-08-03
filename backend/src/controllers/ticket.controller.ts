import { RequestHandler } from "express";
import TicketModel from "../models/TicketModel";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constants/http";
import mongoose from "mongoose";
import path from 'path';

export const createTicketHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventName, category, price, stock, status, content } = req.body;

    const newTicket = new TicketModel({ eventName, category, price, stock, status, content });
    await newTicket.save();

    res.status(CREATED).json({
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketHandler: RequestHandler = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { eventName, category, price, stock, content, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      res.status(BAD_REQUEST).json({ message: "Invalid ticket ID" });
    }


    let uploadedImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      uploadedImages = req.files.map((file) => {
        let filePath = path.join('/uploads', file.filename);
        return filePath.replace(/\\/g, '/'); // Ganti \ dengan /
      });
    }

    let parsedContent: any = {};
    try {
      parsedContent = typeof content === "string" ? JSON.parse(content) : content;
    } catch (err) {
      res.status(BAD_REQUEST).json({ message: "Invalid JSON format in content" });
    }

    parsedContent = parsedContent || {};
    parsedContent.lineup = parsedContent.lineup || {};

    parsedContent.lineup = {
      lineUpTitle: parsedContent.lineup.lineUpTitle || "",
      lineUpImage: parsedContent.lineup.lineUpImage || "",
      lineUpDesc: parsedContent.lineup.lineUpDesc || "",
      logoImage: parsedContent.lineup.logoImage || "",
      instagramUrl: parsedContent.lineup.instagramUrl || "",
      spotifyUrl: parsedContent.lineup.spotifyUrl || "",
    };

    if (uploadedImages.length > 0) {
      parsedContent.headlineImage = uploadedImages[0] || parsedContent.headlineImage;
      if (uploadedImages.length > 1) {
        parsedContent.lineup.lineUpImage = uploadedImages[1] || parsedContent.lineup.lineUpImage;
      }
      if (uploadedImages.length > 2) {
        parsedContent.lineup.logoImage = uploadedImages[2] || parsedContent.lineup.logoImage;
      }
    }

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      ticketId,
      {
        eventName,
        category,
        price,
        stock,
        content: parsedContent,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      res.status(NOT_FOUND).json({ message: "Ticket not found" });
    }

    res.status(OK).json({
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};
