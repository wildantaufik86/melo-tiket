'use client'

import { ICategory } from "@/types/Category";
import { useState } from "react";
import { ITicketPayload } from "@/app/api/event";
import { TicketStatus } from "@/types/Ticket";
import { ITicketTemplate } from "@/types/Template";

interface TicketFormProps {
    categories: ICategory[];
    templates: ITicketTemplate[];
    onSave: (payload: ITicketPayload) => void;
}

const initialState: ITicketPayload = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    templateImage: '',
    templateLayout: '', // Anda bisa sesuaikan ini
    status: TicketStatus.AVAILABLE
};

export default function TicketForm({ categories, templates, onSave }: TicketFormProps) {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTemplateId = e.target.value;
        const selectedTemplate = templates.find(t => t._id === selectedTemplateId);
        if (selectedTemplate) {
            setFormData(prev => ({
                ...prev,
                templateImage: selectedTemplate.templateImage
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.templateImage) {
            alert('Harap pilih kategori dan template.');
            return;
        }
        onSave(formData);
        setFormData(initialState); // Reset form setelah submit
    };

    return (
        <div className="p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Add New Ticket Type</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Ticket Name (e.g., Presale 1)" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required />
                <select name="category" value={formData.category} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required />
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required />
                <select onChange={handleTemplateChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required>
                    <option value="">Select Template</option>
                    {templates.map(temp => <option key={temp._id} value={temp.templateImage}>{temp.name}</option>)}
                </select>
                {formData.templateImage && <img src={`${formData.templateImage}`} alt="Template Preview" className="h-16 object-contain border rounded"/>}
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 text-sm">Add Ticket</button>
            </form>
        </div>
    );
}
