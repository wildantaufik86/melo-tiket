'use client';

import { fetchAllEvents, fetchEventById } from '@/app/api/event';
import TicketCard from '@/components/fragments/card/TicketCard';
import Label from '@/components/fragments/label/Label';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { IEvent } from '@/types/Event';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function TicketSection() {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const getEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchEventById('6899f694bbde0daae146f849');
      if (response.status == 'success' && response.data) {
        const combinedData: IEvent = {
          ...response.data.event,
          tickets: response.data.tickets
        }
        setEvent(combinedData);
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
  // console.log('Result Data TEsting: ', event);

  if (loading) return null;

  return (
    <section className="relative flex flex-col items-center py-[28%]">
      {/* Judul */}
      <h2 className="z-10 text-xl font-semibold text-center w-[50%]  md:text-3xl lg:text-5xl">
        {event?.eventName || 'Melophile Festival Vol 2'}
      </h2>

      {/* Label */}
      <Label text="GET YOUR TICKET NOW" />

      <div className="absolute inset-0 top-15 mt-32">
        <div className="flex justify-center items-center pb-12 bg-[url(/images/awan.png)] bg-cover bg-no-repeat bg-center aspect-square">
          {/* Grid tiket */}
          <div className="grid grid-cols-3 gap-4 w-full pd-lr mt-[25%] place-items-center md:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-8  lg:mt-0">
            {event?.tickets && event?.tickets.map((tc) => (
              <TicketCard
                key={tc._id}
                ticket={tc}
                idTicket={tc._id}
                idEvent={event?._id}
                />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
