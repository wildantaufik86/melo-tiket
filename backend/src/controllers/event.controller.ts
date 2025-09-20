import { RequestHandler } from "express";
import EventModel from "../models/EventModel";
import { BAD_REQUEST, CREATED, NO_CONTENT, NOT_FOUND, OK } from "../constants/http";
import TicketModel from "../models/TicketModel";
import appAssert from "../utils/appAssert";
import mongoose from "mongoose";
import { TicketStatus } from "../types/Ticket";

export const createEventHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventName, date, time, address, description } = req.body;

    // Validasi dasar (lebih baik menggunakan Zod atau Joi untuk proyek besar)
    appAssert(eventName && date && time && address, BAD_REQUEST, "Missing required event fields");

    // Cek duplikasi nama event
    const existingEvent = await EventModel.findOne({ eventName });
    appAssert(!existingEvent, BAD_REQUEST, `Event with name "${eventName}" already exists`);

    const newEvent = new EventModel({
      eventName,
      date,
      time,
      address,
      description,
      // Field lain bisa ditambahkan di sini, seperti isPublished, headlineImage, dll.
    });

    await newEvent.save();

    res.status(CREATED).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEventsHandler: RequestHandler = async (req, res, next) => {
  try {
    // Query HANYA event yang sudah siap ditampilkan ke publik
    const events = await EventModel.find({ isPublished: true }).sort({ date: 1 }); // Urutkan berdasarkan tanggal terdekat

    res.status(OK).json({
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await EventModel.findById(eventId);
    appAssert(event && event.isPublished, NOT_FOUND, "Event not found");

    const availableTickets = await TicketModel.find({
      eventId: eventId,
      status: TicketStatus.AVAILABLE,
    });

    res.status(OK).json({
      event,
      tickets: availableTickets,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    const updatedEvent = await EventModel.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true } // `new: true` untuk mengembalikan dokumen baru
    );

    appAssert(updatedEvent, NOT_FOUND, "Event not found");

    res.status(OK).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEventHandler: RequestHandler = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { eventId } = req.params;

    // Cari event terlebih dahulu untuk memastikan ada
    const eventToDelete = await EventModel.findById(eventId).session(session);
    appAssert(eventToDelete, NOT_FOUND, "Event not found");

    // 1. Hapus semua tiket yang terkait dengan event ini
    await TicketModel.deleteMany({ eventId: eventId }).session(session);

    // 2. Hapus event itu sendiri
    await eventToDelete.deleteOne({ session });

    // Jika semua berhasil, commit transaksi
    await session.commitTransaction();

    res.status(NO_CONTENT).send(); // Status 204 No Content adalah standar untuk delete sukses

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
