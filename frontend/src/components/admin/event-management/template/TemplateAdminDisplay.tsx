'use client'

import { createTemplate, fetchAllTemplates } from "@/app/api/template";
import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { ToastAlert, ToastSuccess } from "@/lib/validations/toast/ToastNofication";
import { ITicketTemplate } from "@/types/Template";
import { TicketIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function TemplateAdminPage() {
    const [templates, setTemplates] = useState<ITicketTemplate[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const breadcrumbItems: BreadCrumbItem[] = [
        { label: "Dashboard", href: "/admin/homepage", icon: <TicketIcon size={16} /> },
        { label: "Template Management" }
    ];

    const loadTemplates = async () => {
        const result = await fetchAllTemplates();
        if (result.status === 'success') {
            setTemplates(result.data || []);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !imageFile) {
            alert('Template name and image are required.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('templateImage', imageFile);

        const result = await createTemplate(formData);
        if (result.status === 'success') {
            ToastSuccess('Template created successfully!');
            setName('');
            setDescription('');
            setImageFile(null);
            loadTemplates(); // Refresh list
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    return (
        <section>
            <BreadCrumb items={breadcrumbItems} />
            <div className="w-full bg-white rounded-lg flex justify-center items-center shadow-xl p-6 sm:p-8 border border-gray-200 space-y-10">
              <div className="w-full max-w-2xl space-y-6">
                {/* Form Section */}
                <div className="p-6 rounded-lg shadow-md border border-gray-300">
                    <h2 className="text-lg font-bold mb-4">Add New Template</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template Name" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full"></textarea>
                        <input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full" />
                        <button type="submit" className="bg-blue-600 text-white py-1 text-sm rounded w-full">Create Template</button>
                    </form>
                </div>
                {/* List Section */}
                <div className="p-6 rounded-lg shadow-md border border-gray-300">
                    <h2 className="text-lg font-bold mb-4">Existing Templates</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {templates.map(template => (
                            <div key={template._id} className="border rounded p-2 text-center">
                                <img src={`${template.templateImage}`} alt={template.name} className="h-24 w-full object-contain mb-2"/>
                                <p className="font-semibold">{template.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
        </section>
    );
}
