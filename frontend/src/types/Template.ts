export interface ITicketTemplate {
  _id?: string;
  name: string;
  description?: string;
  templateImage: string;
  status: 'active' | 'archived';
}
