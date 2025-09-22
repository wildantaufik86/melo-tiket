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
  headlineImage?: string;
  lineup: ILineup[];
  isPublished: boolean;
}
