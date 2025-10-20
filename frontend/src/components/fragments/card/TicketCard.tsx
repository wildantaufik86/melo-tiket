import { Orders } from '@/context/ordersContext';
import { formattedPrice } from '@/utils/universalUtils';
import localFont from 'next/font/local';
import Link from 'next/link';
import Image from 'next/image'; // <-- 1. Import komponen Image
import { memo } from 'react';

const brotherFont = localFont({
  src: '../../../../public/fonts/BROTHER-Bold.otf',
  display: 'swap',
});
type TicketCardProps = {
  ticket: Orders;
  idEvent?: string;
  handleOrder: (params: string) => void;
};

const TicketCard = memo(function TicketCard({
  ticket,
  idEvent,
  handleOrder,
}: TicketCardProps) {
  return (
    <div
      className={`relative aspect-[2/3] w-full max-w-[200px] lg:max-w-[250px] xl:max-w-[300px] hover:scale-105 duration-200 ease-in-out ${
        ticket.status === 'Available' ? 'opacity-100' : 'opacity-90'
      }`}
    >
      <Image
        src="/images/bg-ticket.webp"
        alt="Ticket background"
        fill
        className="object-contain select-none pointer-events-none"
        quality={70}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 33vw"
        priority={true}
        fetchPriority='high'
      />

      {/* 3. Bungkus konten dengan div yang diletakkan di atas gambar */}
      <div className="relative z-10 flex flex-col justify-between items-center h-full">
        <div className="flex flex-col items-center gap-4 py-8">
          <h3
            className={`font-black text-xl sm:text-2xl lg:text-3xl w-[90%] text-wrap text-center h-[50px] ${brotherFont.className}`}
          >
            {ticket.name || ''}
          </h3>
          <p className="text-xs text-center flex flex-col sm:text-lg lg:mt-8">
            IDR{' '}
            <span className="text-sm font-black sm:text-xl">
              {formattedPrice(ticket.price)}
            </span>
          </p>
        </div>

        <Link
          onClick={
            ticket.status === 'Available' && ticket.stock > 0
              ? () => handleOrder(ticket._id!)
              : undefined
          }
          href={`${
            ticket.status === 'Available' && ticket.stock > 0
              ? `/checkout/event/${idEvent}`
              : ''
          }`}
          className={`p-[1px] rounded-sm bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 ${
            ticket.status === 'Available' && ticket.stock > 0
              ? 'cursor-pointer'
              : 'cursor-not-allowed'
          } mb-7 lg:mb-12`}
        >
          <div className="rounded-sm font-semibold bg-[#252222] text-center text-[10px] py-2 px-4 sm:text-sm">
            {ticket.status === 'Available'
              ? ticket.stock > 0
                ? 'BUY TICKETS'
                : 'SOLD OUT'
              : ticket.status}
          </div>
        </Link>
      </div>
    </div>
  );
});

export default TicketCard;
