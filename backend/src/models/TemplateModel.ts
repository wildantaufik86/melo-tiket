import { model, Schema } from 'mongoose';
import { ITemplate } from '../types/Template';

const ticketTemplateSchema = new Schema<ITemplate>(
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

const TicketTemplate = model<ITemplate>('TicketTemplate', ticketTemplateSchema);

export default TicketTemplate;
