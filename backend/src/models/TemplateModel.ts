import { model, Schema } from 'mongoose';
import { ITicketTemplate } from '../types/Template';

const ticketTemplateSchema = new Schema<ITicketTemplate>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    templateImage: { type: String, required: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

const TicketTemplate = model<ITicketTemplate>('TicketTemplate', ticketTemplateSchema);

export default TicketTemplate;
