import { Orders } from '@/context/ordersContext';
import { formattedPrice } from '@/utils/universalUtils';
import localFont from 'next/font/local';
import Link from 'next/link';

const brotherFont = localFont({
  src: '../../../../public/fonts/BROTHER-Bold.otf',
});

type TicketCardProps = {
  ticket: Orders;
  idEvent?: string;
  handleOrder: (params: string) => void;
};

export default function TicketCard({
  ticket,
  idEvent,
  handleOrder,
}: TicketCardProps) {
  return (
    <div
      className={`bg-[url(/images/bg-ticket.webp)] bg-contain bg-center bg-no-repeat aspect-2/3 flex justify-center items-center w-full max-w-[180px] sm:max-w-[180px] lg:max-w-[250px] xl:max-w-[300px] hover:scale-110 duration-200 ease-in-out ${
        ticket.status === 'Available' ? 'opacity-100' : 'opacity-90'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <h3
          className={`font-black text-xl text-wrap w-full text-center sm:text-4xl lg:text-5xl ${brotherFont.className}`}
        >
          {ticket.name || ''}
        </h3>
        <p className="text-xs text-center flex flex-col sm:text-lg">
          IDR{' '}
          <span className="text-sm font-black sm:text-xl">
            {formattedPrice(ticket.price)}
          </span>
        </p>
        <Link
          onClick={
            ticket.status === 'Available'
              ? () => handleOrder(ticket._id!)
              : undefined
          }
          href={`${
            ticket.status === 'Available' ? '/checkout/event/${idEvent}' : ''
          }`}
          className={`p-[1px] rounded-sm bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 ${
            ticket.status === 'Available'
              ? 'cursor-pointer'
              : 'cursor-not-allowed'
          }`}
        >
          <div className="rounded-sm font-semibold bg-secondary text-center text-[10px] py-2 px-4 sm:text-sm">
            {ticket.status === 'Available' ? 'BUY TICKETS' : ticket.status}
          </div>
        </Link>
      </div>
    </div>
  );
}
