'use client';

import { formattedPrice } from '@/utils/universalUtils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

type Ticket = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  isOpen: boolean;
};

type TicketProps = {
  ticket: Ticket;
  toggleOpen?: () => void;
  incrementQty?: () => void;
  decrementQty?: () => void;
};

export default function ListTicketSection() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, name: 'VIP', price: 1000000, quantity: 0, isOpen: false },
    { id: 2, name: 'Festival 1', price: 750000, quantity: 0, isOpen: false },
    { id: 3, name: 'Festival 2', price: 500000, quantity: 0, isOpen: false },
    { id: 4, name: 'Tribun', price: 250000, quantity: 0, isOpen: false },
  ]);

  const totalPrice = tickets.reduce(
    (total, ticket) => total + ticket.price * ticket.quantity,
    0
  );

  const toggleOpen = (id: number) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, isOpen: !ticket.isOpen } : ticket
      )
    );
  };

  const incrementQty = (id: number) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, quantity: t.quantity + 1 } : t))
    );
  };

  const decrementQty = (id: number) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id && t.quantity > 0 ? { ...t, quantity: t.quantity - 1 } : t
      )
    );
  };

  const TicketCard = ({
    ticket,
    toggleOpen,
    decrementQty,
    incrementQty,
  }: TicketProps) => {
    return (
      <div className="flex flex-col rounded-sm p-4 bg-secondary">
        <p
          onClick={toggleOpen}
          className="font-semibold flex justify-between items-center  cursor-pointer"
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
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              toggleOpen={() => toggleOpen(ticket.id)}
              incrementQty={() => incrementQty(ticket.id)}
              decrementQty={() => decrementQty(ticket.id)}
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
