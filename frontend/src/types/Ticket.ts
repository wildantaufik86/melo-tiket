export enum TicketStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
  SOLD_OUT = "Sold Out",
}

export interface ITicket {
  _id?: string;
  eventId?: string;
  category: string;
  name: string;
  price: number;
  stock: number;
  status: TicketStatus;
  templateImage: string;
  templateLayout: string;
}
