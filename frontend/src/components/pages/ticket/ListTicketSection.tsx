'use client';

import { fetchAllTicket } from '@/app/api/ticket';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { ITicket } from '@/types/Ticket';
import { setLocalStorage } from '@/utils/clientUtils';
import { formattedPrice } from '@/utils/universalUtils';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

type TicketProps = {
  tickets: ITicket[];
  eventId: string;
};

type TicketWithState = ITicket & {
  quantity: number;
  isOpen: boolean;
};

type TicketCardProps = {
  ticket: ITicket & TicketWithState;
  toggleOpen?: () => void;
  incrementQty?: () => void;
  decrementQty?: () => void;
};

export default function ListTicketSection({ tickets, eventId }: TicketProps) {
  const [availableTickets, setAvailableTickets] = useState<TicketWithState[]>(
    []
  );
  console.log(availableTickets);
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
      prev.map((t) => (t._id === id ? { ...t, quantity: t.quantity + 1 } : t))
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
    if (selectedTickets.length > 0) setLocalStorage('order', selectedTickets);
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
          src="/images/poster-utama-dewa-19.jpg"
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
      <div className="flex items-stretch bg-white rounded-sm mt-4">
        <p className="flex flex-col font-bold lg:text-xl text-black py-2 px-4">
          TOTAL
          <span className="font-normal lg:text-base">
            {formattedPrice(totalPrice)}
          </span>
        </p>
        <Link
          onClick={createTemporaryOrder}
          href={`/checkout/event/${eventId}`}
          className="ml-auto py-2 px-4 flex justify-center items-center bg-red-500 text-white font-semibold lg:text-xl"
        >
          Lanjutkan
        </Link>
      </div>
    </section>
  );
}

const TickedAccordion = ({
  ticket,
  toggleOpen,
  decrementQty,
  incrementQty,
}: TicketCardProps) => {
  return (
    <div className="flex flex-col rounded-sm p-4 bg-secondary">
      <p
        onClick={ticket.status === 'Available' ? toggleOpen : undefined}
        className={`font-black lg:text-xl flex justify-between items-center ${
          ticket.status === 'Available'
            ? 'cursor-pointer'
            : 'cursor-not-allowed'
        } `}
      >
        {ticket.name}{' '}
        <span>
          <FaChevronDown
            className={`transition-transform duration-300 ${
              ticket.isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </span>
      </p>
      <div
        className={`mt-4 bg-white text-black justify-between items-center py-2 px-4 rounded-sm  transition-all ${
          ticket.isOpen ? 'scale-y-100 flex ' : 'scale-y-0 hidden'
        }`}
      >
        <p className="flex flex-col font-bold lg:text-xl">
          {ticket.category.name}{' '}
          <span className="font-light lg:text-base">
            {formattedPrice(ticket.price)}
          </span>
        </p>
        <div className="flex items-center">
          <div
            onClick={decrementQty}
            className="font-semibold text-white bg-red-500 w-5 h-5 rounded-full flex justify-center items-center cursor-pointer"
          >
            -
          </div>
          <span className="px-4 font-semibold lg:text-xl">
            {ticket.quantity}
          </span>
          <div
            onClick={incrementQty}
            className="font-semibold text-white bg-red-500 w-5 h-5 rounded-full flex justify-center items-center cursor-pointer"
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
};
