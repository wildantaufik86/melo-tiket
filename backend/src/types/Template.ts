export interface ITemplate {
    _id: string;
    name: string;
    description?: string;
    templateImage: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}
