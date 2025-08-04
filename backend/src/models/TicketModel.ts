import mongoose, { Schema, Document } from "mongoose";

export enum TicketStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
  SOLD_OUT = "Sold Out",
}

export interface ILineup {
  lineUpTitle?: string;
  lineUpImage?: string;
  lineUpDesc?: string;
  logoImage?: string;
  instagramUrl?: string;
  spotifyUrl?: string;
}

export interface IContent {
  date?: string;
  time?: string;
  address?: string;
  addressUrl?: string;
  descriptionEvent?: string;
  headlineImage?: string;
  lineup?: ILineup;
}

export interface ITicket extends Document {
  _id: Schema.Types.ObjectId;
  eventName: string;
  category: string;
  price: number;
  stock: number;
  status: TicketStatus;
  content: IContent;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for lineup
const LineupSchema = new Schema<ILineup>(
  {
    lineUpTitle: { type: String, default: "" },
    lineUpImage: { type: String, default: "" },
    lineUpDesc: { type: String, default: "" },
    logoImage: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    spotifyUrl: { type: String, default: "" },
  },
  { _id: false }
);

// Sub-schema for content
const ContentSchema = new Schema<IContent>(
  {
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    address: { type: String, default: "" },
    addressUrl: { type: String, default: "" },
    descriptionEvent: { type: String, default: "" },
    headlineImage: { type: String, default: "" },
    lineup: { type: LineupSchema, default: {} },
  },
  { _id: false }
);

const TicketSchema = new Schema<ITicket>(
  {
    eventName: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.UNAVAILABLE,
    },
    content: { type: ContentSchema, default: {} },
  },
  { timestamps: true }
);

TicketSchema.index({ eventName: 1, category: 1 }); // compound index example

const TicketModel = mongoose.model<ITicket>("Ticket", TicketSchema);
export default TicketModel;
