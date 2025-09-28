'use client';

import TickedAccordion from '@/components/fragments/accordion/TicketAccordion';
import { useOrder } from '@/context/ordersContext';
import { TicketProps, TicketWithState } from '@/types/Ticket';
import { formattedPrice } from '@/utils/universalUtils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListTicketSection({ tickets, eventId }: TicketProps) {
  const [availableTickets, setAvailableTickets] = useState<TicketWithState[]>(
    []
  );
  const { orders, saveOrders } = useOrder();
  const [selectedTickets, setSelectedTickets] = useState<TicketWithState[]>([]);

  useEffect(() => {
    if (tickets.length > 0) {
      const mapped: TicketWithState[] = tickets.map((ticket, index) => ({
        ...ticket,
        quantity: 0,
        isOpen: false,
      }));
      setAvailableTickets(mapped);
    }
  }, [tickets]);

  const totalPrice = availableTickets.reduce(
    (total, ticket) => total + ticket.price * ticket.quantity,
    0
  );

  const toggleOpen = (id?: string) => {
    setAvailableTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === id ? { ...ticket, isOpen: !ticket.isOpen } : ticket
      )
    );
  };

  const incrementQty = (id?: string) => {
    setAvailableTickets((prev) =>
      prev.map((t) =>
        t._id === id && t.quantity < 4 ? { ...t, quantity: t.quantity + 1 } : t
      )
    );
  };

  const decrementQty = (id?: string) => {
    setAvailableTickets((prev) =>
      prev.map((t) =>
        t._id === id && t.quantity > 0 ? { ...t, quantity: t.quantity - 1 } : t
      )
    );
  };

  const createTemporaryOrder = (): void => {
    if (selectedTickets.length > 0) saveOrders(selectedTickets);
  };

  useEffect(() => {
    if (availableTickets.length > 0) {
      const selected = availableTickets.filter((data) => data.quantity > 0);
      setSelectedTickets(selected);
    }
  }, [availableTickets]);

  return (
    <section className="flex flex-col md:flex-1 md:mt-10">
      <div className="relative aspect-2/3">
        <Image
          src="/images/panel-ticket-venue.jpg"
          alt="ticket-poster"
          fill
          className="object-contain md:object-top"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-black lg:text-3xl">Ticket</h3>
        <div className="flex flex-col gap-4">
          {availableTickets.map((data) => (
            <TickedAccordion
              key={data._id}
              ticket={data}
              toggleOpen={() => toggleOpen(data?._id)}
              incrementQty={() => incrementQty(data?._id)}
              decrementQty={() => decrementQty(data?._id)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-stretch bg-white rounded-sm mt-4 overflow-hidden">
        <p className="flex flex-col font-bold lg:text-xl text-black py-2 px-4">
          TOTAL
          <span className="font-normal lg:text-base">
            {formattedPrice(totalPrice)}
          </span>
        </p>
        <Link
          onClick={createTemporaryOrder}
          href={`/checkout/event/${eventId}`}
          className="ml-auto py-2 px-4 flex justify-center items-center bg-red-500 text-white font-semibold lg:text-xl hover:bg-hover transition-colors"
        >
          Lanjutkan
        </Link>
      </div>
    </section>
  );
}
