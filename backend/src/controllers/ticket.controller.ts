import { RequestHandler } from "express";
import TicketModel from "../models/TicketModel";
import EventModel from "../models/EventModel";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, CREATED, NO_CONTENT, NOT_FOUND, OK } from "../constants/http";

export const addTicketTypeToEventHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { category, price, stock, templateImage, templateLayout } = req.body;

    // 1. Validasi input dasar
    appAssert(category && price !== undefined && stock !== undefined, BAD_REQUEST, "Category, price, and stock are required");
    appAssert(templateImage && templateLayout, BAD_REQUEST, "Template image and layout are required");

    // 2. Pastikan event induknya ada sebelum menambahkan tiket
    const parentEvent = await EventModel.findById(eventId);
    appAssert(parentEvent, NOT_FOUND, "Parent event not found, cannot add ticket");

    // 3. Buat instance tiket baru, hubungkan dengan eventId
    const newTicket = new TicketModel({
      eventId,
      category,
      price,
      stock,
      templateImage,
      templateLayout,
    });

    await newTicket.save();

    res.status(CREATED).json({
      message: `Ticket category '${category}' added to event '${parentEvent.eventName}' successfully`,
      ticket: newTicket,
    });

  } catch (error) {
    // Error akan ditangani oleh unique index jika kategori duplikat
    next(error);
  }
};

export const getAllTicketTypesForEventHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const tickets = await TicketModel.find({ eventId });

    res.status(OK).json({
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketTypeByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId, ticketId } = req.params;

    // Cari tiket berdasarkan ID-nya DAN ID event-nya untuk keamanan
    const ticket = await TicketModel.findOne({ _id: ticketId, eventId });
    appAssert(ticket, NOT_FOUND, "Ticket category not found in this event");

    res.status(OK).json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicketTypeHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId, ticketId } = req.params;
    const updateData = req.body;

    // Cari dan update dalam satu query atomik
    const updatedTicket = await TicketModel.findOneAndUpdate(
      { _id: ticketId, eventId }, // Kondisi pencarian yang aman
      { $set: updateData },
      { new: true, runValidators: true }
    );

    appAssert(updatedTicket, NOT_FOUND, "Ticket category not found in this event");

    res.status(OK).json({
      message: "Ticket category updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTicketTypeHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId, ticketId } = req.params;

    const result = await TicketModel.findOneAndDelete({ _id: ticketId, eventId });
    appAssert(result, NOT_FOUND, "Ticket category not found in this event");

    res.status(NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
