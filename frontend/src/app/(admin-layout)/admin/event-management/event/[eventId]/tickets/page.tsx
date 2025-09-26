'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchAllTicket } from '@/app/api/ticket';
import { fetchAllCategories } from '@/app/api/categories';
import BreadCrumb, { BreadCrumbItem } from '@/components/navigation/BreadCrumb';
import { ITicket } from '@/types/Ticket';
import { ICategory } from '@/types/Category';
import { TicketIcon } from '@phosphor-icons/react';
import { addTicketTypeToEvent } from '@/app/api/event';
import { ITicketPayload } from '@/app/api/event';
import { ITicketTemplate } from '@/types/Template';
import { fetchAllTemplates } from '@/app/api/template';
import TicketForm from '@/components/admin/event-management/ticket/TicketForm';
import TicketList from '@/components/admin/event-management/ticket/TicketList';

interface TicketsForEventPageProps {
    params: Promise<{ eventId: string; }>;
}

export default function TicketsForEventPage({ params }: TicketsForEventPageProps) {
    const { eventId } = React.use(params);

    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [templates, setTemplates] = useState<ITicketTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbItems: BreadCrumbItem[] = [
        { label: "Dashboard", href: "/admin/homepage", icon: <TicketIcon size={16} /> },
        { label: "Event Management", href: "/admin/events" },
        { label: "Ticket Management" }
    ];

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Ambil semua data yang dibutuhkan secara paralel
            const [ticketsRes, categoriesRes, templatesRes] = await Promise.all([
                fetchAllTicket(eventId),
                fetchAllCategories(),
                fetchAllTemplates()
            ]);

            if (ticketsRes.status === 'success') setTickets(ticketsRes.data || []);
            else throw new Error('Gagal memuat tiket.');

            if (categoriesRes.status === 'success') setCategories(categoriesRes.data || []);
            else throw new Error('Gagal memuat kategori.');

            if (templatesRes.status === 'success') setTemplates(templatesRes.data || []);
            else throw new Error('Gagal memuat template.');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handleSaveTicket = async (payload: ITicketPayload) => {
        const result = await addTicketTypeToEvent(eventId, payload);
        if (result.status === 'success') {
            alert('Tiket berhasil ditambahkan!');
            loadInitialData(); // Muat ulang data
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    if (loading) return <div>Loading ticket data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <section>
            <BreadCrumb items={breadcrumbItems} />
            <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 space-y-10">
                <TicketForm
                    categories={categories}
                    templates={templates}
                    onSave={handleSaveTicket}
                />
                <TicketList tickets={tickets} />
            </div>
        </section>
    );
}
