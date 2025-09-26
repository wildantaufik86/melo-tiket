'use client'

import { ICategory } from "@/types/Category";
import { useEffect, useState } from "react";
import { ITicketPayload } from "@/app/api/event";
import { TicketStatus } from "@/types/Ticket";
import { ITicketTemplate } from "@/types/Template";
import { ITicket } from "@/types/Ticket"; // DITAMBAHKAN

interface TicketFormProps {
    categories: ICategory[];
    templates: ITicketTemplate[];
    onSave: (payload: ITicketPayload, ticketId?: string) => void; // DIUBAH: onSave bisa menerima ticketId
    editingTicket: ITicket | null;   // DITAMBAHKAN
    onCancelEdit: () => void;      // DITAMBAHKAN
}

// DIUBAH: Ganti 'category' ke 'category' agar konsisten dengan backend
const initialState: ITicketPayload = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    templateImage: '',
    templateLayout: 'layout-vip.json',
    status: TicketStatus.AVAILABLE
};

export default function TicketForm({ categories, templates, onSave, editingTicket, onCancelEdit }: TicketFormProps) {
    const [formData, setFormData] = useState(initialState);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    // DITAMBAHKAN: useEffect untuk mengisi form saat mode edit aktif
    useEffect(() => {
        if (editingTicket) {
            setFormData({
                name: editingTicket.name,
                category: editingTicket.category._id, // Gunakan ID
                price: editingTicket.price,
                stock: editingTicket.stock,
                templateImage: editingTicket.templateImage,
                templateLayout: editingTicket.templateLayout,
                status: editingTicket.status
            });
            const matchingTemplate = templates.find(t => t.templateImage === editingTicket.templateImage);
            if (matchingTemplate) {
                setSelectedTemplateId(matchingTemplate?._id ?? '');
            }
        } else {
            setFormData(initialState);
            setSelectedTemplateId('');
        }
    }, [editingTicket, templates]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setSelectedTemplateId(selectedId);
        if (selectedId) {
            const selectedTemplate = templates.find(t => t._id === selectedId);
            if (selectedTemplate) {
                setFormData(prev => ({ ...prev, templateImage: selectedTemplate.templateImage }));
            }
        } else {
            setFormData(prev => ({ ...prev, templateImage: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.templateImage) {
            alert('Harap pilih kategori dan template.');
            return;
        }
        // Kirim ID tiket jika dalam mode edit
        onSave(formData, editingTicket?._id);

        // Hanya reset jika ini adalah mode 'create' baru
        if (!editingTicket) {
            setFormData(initialState);
            setSelectedTemplateId('');
        }
    };

    const isEditMode = !!editingTicket;

    return (
        <div className="p-6 rounded-lg shadow-sm border border-gray-200">
            {/* DIUBAH: Judul dinamis */}
            <h2 className="text-lg font-bold mb-4">{isEditMode ? `Edit Ticket: ${editingTicket.name}` : 'Add New Ticket Type'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Ticket Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Ticket Name (e.g., Presale 1)" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required />
              </div>
              <div>
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1.5 rounded-sm w-full" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>

              </div>
              <div>
                <label>Price</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required />
              </div>
              <div>
                <label>Stock</label>
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required />
              </div>
              <div>
                <label>Ticket Template</label>
                <select value={selectedTemplateId} onChange={handleTemplateChange} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" required>
                    <option value="">Select Template</option>
                    {templates.map(temp => <option key={temp._id} value={temp._id}>{temp.name}</option>)}
                </select>
              </div>
              <div className="w-full">
                {formData.templateImage &&
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/templateImage/${formData.templateImage}`} alt="Template Preview" className="h-16 object-contain border rounded"/>}
              </div>

                {/* DIUBAH: Tombol dinamis */}
                <div className="md:col-span-2 flex justify-end gap-2">
                    {isEditMode && (
                        <button type="button" onClick={onCancelEdit} className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600 text-sm">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 text-sm">
                        {isEditMode ? 'Update Ticket' : 'Add Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
}
