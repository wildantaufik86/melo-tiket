import { RequestHandler } from "express";
import TicketModel from "../models/TicketModel";
import EventModel from "../models/EventModel";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, CREATED, NO_CONTENT, NOT_FOUND, OK } from "../constants/http";
import CategoryModel from "../models/CategoryModel";

export const addTicketTypeToEventHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { categoryId, price, stock, name, templateImage, templateLayout } = req.body;

    appAssert(categoryId && price !== undefined && stock !== undefined, BAD_REQUEST, "Category, price, and stock are required");
    appAssert(templateImage && templateLayout, BAD_REQUEST, "Template image and layout are required");
    appAssert(name, BAD_REQUEST, "Name is required");


    const categoryExists = await CategoryModel.findById(categoryId);
    appAssert(categoryExists, NOT_FOUND, "Category not found");

    const parentEvent = await EventModel.findById(eventId);
    appAssert(parentEvent, NOT_FOUND, "Parent event not found, cannot add ticket");

    const newTicket = new TicketModel({
      eventId,
      category: categoryId,
      name,
      price,
      stock,
      templateImage,
      templateLayout,
    });

    await newTicket.save();

    res.status(CREATED).json({
      message: `Ticket category '${categoryId}' added to event '${parentEvent.eventName}' successfully`,
      ticket: newTicket,
    });

  } catch (error) {
    next(error);
  }
};

export const getAllTicketTypesForEventHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const tickets = await TicketModel.find({ eventId }).populate('category', 'name slug');

    res.status(OK).json({ count: tickets.length, tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicketTypeByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eventId, ticketId } = req.params;

    const ticket = await TicketModel.findOne({ _id: ticketId, eventId }).populate('category', 'name slug');
    appAssert(ticket, NOT_FOUND, "Ticket category not found in this event");

    res.status(OK).json({
      message: "Ticket successfully received.",
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketTypeHandler: RequestHandler = async (req, res, next) => {
  try {
    const { categoryId, eventId, ticketId } = req.params;
    const updateData = req.body;

    if (categoryId) {
      const categoryExists = await CategoryModel.findById(categoryId);
      appAssert(categoryExists, NOT_FOUND, "New category not found");
      (updateData as any).category = categoryId;
    }

    const updatedTicket = await TicketModel.findOneAndUpdate(
      { _id: ticketId, eventId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

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
