export interface ITicketTemplate extends Document {
  name: string;
  description?: string;
  templateImage: string;
  status: 'active' | 'archived';
}
