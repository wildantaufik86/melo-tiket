'use client';

import React, { useCallback, useEffect, useState } from 'react';
// DIUBAH: Impor semua fungsi API yang dibutuhkan
import { addTicketTypeToEvent, ITicketPayload, updateTicketType } from '@/app/api/event';
import { fetchAllCategories } from '@/app/api/categories';
import { fetchAllTemplates } from '@/app/api/template';
// ... (import komponen lainnya)
import { ITicket } from '@/types/Ticket';
import { ICategory } from '@/types/Category';
import { ITicketTemplate } from '@/types/Template';
import TicketForm from '@/components/admin/event-management/ticket/TicketForm';
import TicketList from '@/components/admin/event-management/ticket/TicketList';
import { TicketIcon } from '@phosphor-icons/react';
import BreadCrumb, { BreadCrumbItem } from '@/components/navigation/BreadCrumb';
import { fetchAllTicket } from '@/app/api/ticket';
import { ToastError, ToastSuccess } from '@/lib/validations/toast/ToastNofication';


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

    // DITAMBAHKAN: State untuk melacak tiket yang sedang diedit
    const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);

    // ... (breadcrumbItems dan loadInitialData tetap sama) ...
    const breadcrumbItems: BreadCrumbItem[] = [
        { label: "Dashboard", href: "/admin/homepage", icon: <TicketIcon size={16} /> },
        { label: "Event Management", href: "/admin/events" },
        { label: "Ticket Management" }
    ];

const loadInitialData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const [ticketsRes, categoriesRes, templatesRes] = await Promise.all([
      fetchAllTicket(eventId),
      fetchAllCategories(),
      fetchAllTemplates(),
    ]);

    setTickets(ticketsRes.data || []);
    setCategories(categoriesRes.data || []);
    setTemplates(templatesRes.data || []);
  } catch (err) {
    console.error(err);
    setError("Failed to load data");
  } finally {
    setLoading(false);
  }
}, [eventId]);

useEffect(() => {
  loadInitialData();
}, [loadInitialData]);


    // DITAMBAHKAN: Fungsi untuk memulai mode edit
    const handleEdit = (ticket: ITicket) => {
        setEditingTicket(ticket);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // DITAMBAHKAN: Fungsi untuk membatalkan mode edit
    const handleCancelEdit = () => {
        setEditingTicket(null);
    };

    // DITAMBAHKAN: Fungsi untuk menghapus tiket
    const handleDelete = async (ticketId: string) => {
        // if (!window.confirm("Anda yakin ingin menghapus tiket ini?")) return;

        // const result = await deleteTicket(eventId, ticketId);
        // if (result.status === 'success') {
        //     alert(result.message);
        //     loadInitialData(); // Muat ulang data
        // } else {
        //     alert(`Error: ${result.message}`);
        // }
    };

    // DIUBAH: handleSaveTicket sekarang menangani Create dan Update
    const handleSaveTicket = async (payload: ITicketPayload, ticketId?: string) => {
        let result;
        if (ticketId) {
            // Mode Update
            result = await updateTicketType(eventId, ticketId, payload);
        } else {
            // Mode Create
            result = await addTicketTypeToEvent(eventId, payload);
        }

        if (result.status === 'success') {
            ToastSuccess('Data tiket berhasil disimpan!');
            loadInitialData(); // Muat ulang data
            setEditingTicket(null); // Keluar dari mode edit
        } else {
            ToastError(`Error: ${result.message}`);
        }
    };

    if (loading) return <div>Loading ticket data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <section>
            <BreadCrumb items={breadcrumbItems} />
<div className="w-full bg-white rounded-lg flex justify-center items-center shadow-xl p-6 sm:p-8 border border-gray-200 space-y-10">
              <div className="w-full max-w-2xl space-y-6">
                <TicketForm
                    categories={categories}
                    templates={templates}
                    onSave={handleSaveTicket}
                    editingTicket={editingTicket}
                    onCancelEdit={handleCancelEdit}
                />
                <TicketList
                    tickets={tickets}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
              </div>
            </div>
        </section>
    );
}
