import mongoose, { Schema, Document } from "mongoose";

// Enum untuk mengontrol status penjualan setiap jenis tiket.
export enum TicketStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
  SOLD_OUT = "Sold Out",
}

// Interface TypeScript untuk dokumen Tiket.
export interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  category: string;
  price: number;
  stock: number;
  status: TicketStatus;
  templateImage: string;
  templateLayout: string;
}

// Skema Mongoose untuk Tiket.
const TicketSchema = new Schema<ITicket>(
  {
    // Kunci asing yang menghubungkan ke Event. Ini adalah fondasi desainnya.
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true
    },
    // Nama kategori tiket (e.g., "Presale 1", "VIP").
    category: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    // Status yang bisa diubah oleh admin untuk menonaktifkan penjualan.
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.AVAILABLE,
    },
    // Nama file gambar template (e.g., "template-vip.png").
    templateImage: {
      type: String,
      required: true
    },
    // Nama file JSON layout (e.g., "layout-vip.json").
    templateLayout: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// Mencegah ada 2 kategori tiket yang sama untuk 1 event.
TicketSchema.index({ eventId: 1, category: 1 }, { unique: true });

const TicketModel = mongoose.model<ITicket>("Ticket", TicketSchema);

export default TicketModel;
