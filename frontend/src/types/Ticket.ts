export enum TicketStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
  SOLD_OUT = "Sold Out",
}

export interface ITicket {
  eventId?: string;
  category: string;
  price: number;
  stock: number;
  status: TicketStatus;
  templateImage: string;
  templateLayout: string;
}
