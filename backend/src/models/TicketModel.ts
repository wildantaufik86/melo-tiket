import mongoose, { Schema, Document } from "mongoose";

export interface ILineup {
  lineUpImage?: string;
  logoImage?: string;
  instagramUrl?: string;
  spotifyUrl?: string;
}

export interface IContent {
  date?: string;
  time?: string;
  address?: string;
  descriptionEvent?: string;
  headlineImage?: string;
  lineup?: ILineup; // Tetap object, bukan array
}

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  eventName: string;
  category: string;
  price: number;
  stock: number;
  status: "Available" | "Unavailable" | "Sold Out";
  content: {
    date?: string;
    time?: string;
    address?: string;
    addressUrl?: string;
    descriptionEvent?: string;
    headlineImage?: string;
    lineup?: {
      lineUpTitle?: string;
      lineUpImage?: string;
      lineUpDesc?: string;
      logoImage?: string;
      instagramUrl?: string;
      spotifyUrl?: string;
    };
  };
}

const TicketSchema = new Schema<ITicket>(
  {
    eventName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Available", "Unavailable", "Sold Out"],
      default: "Unavailable",
    },
    content: {
      type: Object,
      default: {
        date: "",
        time: "",
        address: "",
        addressUrl: "",
        descriptionEvent: "",
        headlineImage: "",
        lineup: {
          lineUpTitle: "",
          lineUpImage: "",
          lineUpDesc: "",
          logoImage: "",
          instagramUrl: "",
          spotifyUrl: "",
        },
      },
    },
  },
  { timestamps: true }
);

const TicketModel = mongoose.model<ITicket>("Ticket", TicketSchema);
export default TicketModel;
