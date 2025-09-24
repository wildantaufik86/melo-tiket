'use client';

import { ITicket } from '@/types/Ticket';
import { formattedPrice } from '@/utils/universalUtils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

type TicketProps = {
  tickets: ITicket[];
};

type TicketWithState = ITicket & {
  quantity: number;
  isOpen: boolean;
  name: string;
  idTicket: number;
};

type TicketCardProps = {
  ticket: ITicket & TicketWithState;
  toggleOpen?: () => void;
  incrementQty?: () => void;
  decrementQty?: () => void;
};

export default function ListTicketSection({ tickets }: TicketProps) {
  const [availableTickets, setAvailableTickets] = useState<TicketWithState[]>(
    []
  );

  useEffect(() => {
    if (tickets.length > 0) {
      const mapped: TicketWithState[] = tickets.map((ticket, index) => ({
        ...ticket,
        quantity: 0,
        isOpen: false,
        name: 'VIP',
        idTicket: index + 1,
      }));
      setAvailableTickets(mapped);
    }
  }, [tickets]);

  const totalPrice = availableTickets.reduce(
    (total, ticket) => total + ticket.price * ticket.quantity,
    0
  );

  const toggleOpen = (id: number) => {
    setAvailableTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.idTicket === id ? { ...ticket, isOpen: !ticket.isOpen } : ticket
      )
    );
  };

  const incrementQty = (id: number) => {
    setAvailableTickets((prev) =>
      prev.map((t) =>
        t.idTicket === id ? { ...t, quantity: t.quantity + 1 } : t
      )
    );
  };

  const decrementQty = (id: number) => {
    setAvailableTickets((prev) =>
      prev.map((t) =>
        t.idTicket === id && t.quantity > 0
          ? { ...t, quantity: t.quantity - 1 }
          : t
      )
    );
  };

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
        <h3 className="text-lg font-semibold">Ticket</h3>
        <div className="flex flex-col gap-4">
          {availableTickets.map((data) => (
            <TickedAccordion
              key={data.idTicket}
              ticket={data}
              toggleOpen={() => toggleOpen(data.idTicket)}
              incrementQty={() => incrementQty(data.idTicket)}
              decrementQty={() => decrementQty(data.idTicket)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-stretch bg-white rounded-sm mt-4">
        <p className="flex flex-col font-semibold text-black py-2 px-4">
          TOTAL
          <span>{formattedPrice(totalPrice)}</span>
        </p>
        <Link
          href="/checkout"
          className="ml-auto py-2 px-4 flex justify-center items-center bg-red-500 text-white"
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
        className={`font-semibold flex justify-between items-center ${
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
        <p className="flex flex-col font-semibold">
          {ticket.name}{' '}
          <span className="font-light">{formattedPrice(ticket.price)}</span>
        </p>
        <div className="flex items-center">
          <div
            onClick={decrementQty}
            className="font-semibold text-white bg-red-500 w-5 h-5 rounded-full flex justify-center items-center cursor-pointer"
          >
            -
          </div>
          <span className="px-4">{ticket.quantity}</span>
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
