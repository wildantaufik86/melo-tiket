import { ITicket } from "./Ticket";

export interface ILineup {
  name: string;
  image?: string;
  instagramUrl?: string;
}

export interface IEvent extends Document {
  _id?: string;
  eventName: string;
  date: Date;
  time: string;
  address: string;
  description: string;
  eventDesc?: string;
  ticketDesc?: string;
  headlineImage?: string;
  tickets: ITicket[];
  lineup: ILineup[];
  isPublished: boolean;
}
