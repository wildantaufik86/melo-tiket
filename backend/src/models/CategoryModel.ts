import { Schema, model, Document } from 'mongoose';
import { ICategory } from '../types/Category';

export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {}

const CategorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  deletedAt: { type: Date, default: null, index: true },
}, {
  timestamps: true,
});

const CategoryModel = model<ICategoryDocument>('Category', CategorySchema);

export default CategoryModel;
