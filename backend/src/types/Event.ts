export interface ILineup {
  name: string;
  image?: string;
  instagramUrl?: string;
}

export interface IEvent extends Document {
  toObject(): IEvent & { transactions: ({ tickets: ({ ticketId: { _id: import("mongoose").Types.ObjectId; eventId: IEvent; } & import("./Ticket").ITicket; } & import("./Transaction").IPurchasedTicket)[]; } & import("./Transaction").ITransaction)[]; };
  eventName: string;
  date: Date;
  time: string;
  address: string;
  eventDesc?: string;
  ticketDesc?: string;
  headlineImage?: string;
  lineup: ILineup[];
  isPublished: boolean;
}
