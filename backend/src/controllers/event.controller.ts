import { RequestHandler } from "express";
import EventModel from "../models/EventModel";
import { BAD_REQUEST, CREATED, NO_CONTENT, NOT_FOUND, OK } from "../constants/http";
import TicketModel from "../models/TicketModel";
import appAssert from "../utils/appAssert";
import mongoose from "mongoose";
import { TicketStatus } from "../types/Ticket";

export const createEventHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventName, date, time, address, eventDesc, ticketDesc } = req.body;

    appAssert(eventName && date && time && address, BAD_REQUEST, "Missing required event fields");

    const existingEvent = await EventModel.findOne({ eventName });
    appAssert(!existingEvent, BAD_REQUEST, `Event with name "${eventName}" already exists`);

    appAssert(eventDesc || ticketDesc, BAD_REQUEST, "Event Description or Ticket Description cannot be both empty.");

    const newEvent = new EventModel({
      eventName,
      date,
      time,
      address,
      eventDesc,
      ticketDesc
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
    const events = await EventModel.find();

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
    appAssert(event, NOT_FOUND, "Event not found");

    const availableTickets = await TicketModel.find({
      eventId: eventId
    }).populate('category', 'name slug');

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
    const eventToDelete = await EventModel.findById(eventId).session(session);

    appAssert(eventToDelete, NOT_FOUND, "Event not found");
    await TicketModel.deleteMany({ eventId: eventId }).session(session);
    await eventToDelete.deleteOne({ session });
    await session.commitTransaction();

    res.status(NO_CONTENT).send();

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
