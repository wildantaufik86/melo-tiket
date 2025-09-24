'use client';

import { fetchAllEvents } from '@/app/api/event';
import TicketCard from '@/components/fragments/card/TicketCard';
import Label from '@/components/fragments/label/Label';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { IEvent } from '@/types/Event';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function TicketSection() {
  const [event, setEvent] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const dummyTickets = [
    { id: 1, title: 'VIP', price: 350000 },
    { id: 2, title: 'VIP TRIBUN', price: 350000 },
    { id: 3, title: 'FESTIVAL A', price: 350000 },
    { id: 4, title: 'FESTIVAL B', price: 350000 },
    { id: 5, title: 'TRIBUN', price: 450000 },
  ];

  const getEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllEvents();
      if (response.status == 'success' && response.data) {
        setEvent(response.data as unknown as IEvent[]);
      } else {
        ToastError(response.message);
      }
    } catch (err: any) {
      ToastError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEvent();
  }, [getEvent]);
  console.log('Result Data TEsting: ', event);

  if (loading) return null;

  return (
    <section className="relative flex flex-col items-center py-[28%]">
      {/* Judul */}
      <h2 className="z-10 text-xl font-semibold text-center w-[50%]  md:text-3xl lg:text-5xl">
        {event[0]?.eventName || 'Melophile Festival Vol 2'}
      </h2>

      {/* Label */}
      <Label text="GET YOUR TICKET NOW" />

      <div className="absolute inset-0 top-15 mt-32">
        <div className="flex justify-center items-center pb-12 bg-[url(/images/awan.png)] bg-cover bg-no-repeat bg-center aspect-square">
          {/* Grid tiket */}
          <div className="grid grid-cols-3 gap-4 w-full pd-lr mt-[25%] place-items-center md:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-8  lg:mt-0">
            {dummyTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                idEvent={event[0]?._id}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
