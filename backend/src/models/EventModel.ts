import mongoose, { Schema, Document } from "mongoose";

export interface ILineup {
  name: string;
  image?: string;
  instagramUrl?: string;
}

const LineupSchema = new Schema<ILineup>(
  {
    name: { type: String, required: true },
    image: { type: String },
    instagramUrl: { type: String },
  },
  { _id: false }
);

// Interface utama untuk dokumen Event.
export interface IEvent extends Document {
  eventName: string;
  date: Date;
  time: string;
  address: string;
  description: string;
  headlineImage?: string;
  lineup: ILineup[];
  isPublished: boolean;
}

// Skema Mongoose untuk Event.
const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true, unique: true, trim: true},
    date: { type: Date, required: true},
    time: { type: String, required: true},
    address: { type: String, required: true},
    description: { type: String, required: true},
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
