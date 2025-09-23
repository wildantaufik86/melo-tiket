export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  deletedAt?: Date | null;
}
