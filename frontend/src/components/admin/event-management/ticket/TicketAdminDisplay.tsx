'use client';

import { deleteEvent, fetchAllEvents } from '@/app/api/event';
import BreadCrumb, { BreadCrumbItem } from '@/components/navigation/BreadCrumb';
import { IEvent } from '@/types/Event';
import {
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TicketIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function TicketAdminDisplay() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const breadcrumbItems: BreadCrumbItem[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <TicketIcon size={16} />,
    },
    { label: 'Ticket' },
  ];

  const loadEvents = async () => {
    setLoading(true);
    const result = await fetchAllEvents();
    if (result.status === 'success' && result.data) {
      setEvents(result.data);
    } else {
      setMessage(`Error: ${result.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (
      !window.confirm(
        'Anda yakin ingin menghapus event ini? Semua tiket terkait juga akan terhapus.'
      )
    )
      return;

    const result = await deleteEvent(eventId);
    if (result.status === 'success') {
      setMessage('Event berhasil dihapus.');
    } else {
      setMessage(`Error: ${result.message}`);
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <section>
      <BreadCrumb items={breadcrumbItems} />
      <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 flex justify-center items-center">
        <div className="w-full">
          {message && (
            <p className="mb-4 text-center p-2 bg-gray-100 rounded-md">
              {message}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
                  <th className="py-3 px-6 rounded-tl-2xl">Event Name</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center rounded-tr-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {events.map((event) => (
                  <tr key={event._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium rounded-bl-2xl">
                      {event.eventName}
                    </td>
                    <td className="py-3 px-6">{formatDate(event.date)}</td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          event.isPublished
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {event.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center rounded-br-2xl">
                      <div className="flex item-center justify-center space-x-2">
                        <Link
                          href={`/admin/event-management/event/${event._id}/tickets`}
                          target="_blank"
                          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          title="View Public Page"
                        >
                          <EyeIcon size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
