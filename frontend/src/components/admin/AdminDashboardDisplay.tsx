'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchAllTicket, fetchTicketById } from '@/app/api/ticket';
import { ITicket } from '@/types/Ticket';
import { ToastError } from '@/lib/validations/toast/ToastNofication';

const formattedDate = (dateString: Date | string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminDashbordDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<ITicket[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalPortofolioItems, setTotalPortofolioItems] = useState(0);

    const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllTicket('6899f920f101bb1cc321dd12');
      if (response.status == 'success' && response.data) {
        setTicket(response.data as unknown as ITicket[]);
      } else {
        ToastError(response.message);
      }
    } catch (err: any) {
      ToastError(err.message);
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData])
  console.log(ticket);

  if (isLoading) {
    return (
      <div className="mt-16 flex flex-col px-8 min-h-[400px] items-center justify-center">
        <p className="text-xl text-gray-700">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <section>Dashboard</section>
  );
}
