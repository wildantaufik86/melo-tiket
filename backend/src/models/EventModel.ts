import mongoose, { Schema, Document } from "mongoose";
import { IEvent, ILineup } from "../types/Event";

const LineupSchema = new Schema<ILineup>(
  {
    name: { type: String, required: true },
    image: { type: String },
    instagramUrl: { type: String },
  },
  { _id: false }
);

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true, unique: true, trim: true},
    date: { type: Date, required: true},
    time: { type: String, required: true},
    address: { type: String, required: true},
    eventDesc: { type: String, default: ''},
    ticketDesc: { type: String, default: ''},
    headlineImage: { type: String},
    lineup: { type: [LineupSchema], default: [] },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

const EventModel = mongoose.model<IEvent>("Event", EventSchema);

export default EventModel;
