import { formattedPrice } from '@/utils/universalUtils';
import localFont from 'next/font/local';
import Link from 'next/link';

const brotherFont = localFont({
  src: '../../../../public/fonts/BROTHER-Bold.otf',
});

type TicketCard = {
  id?: number;
  name?: string;
  title?: string;
  price: number;
};

type TicketCardProps = {
  idTicket?: string;
  ticket: TicketCard;
  idEvent?: string;
};

export default function TicketCard({
  ticket,
  idEvent,
  idTicket,
}: TicketCardProps) {
  return (
    <div className="bg-[url(/images/bg-ticket.webp)] bg-contain bg-center bg-no-repeat aspect-2/3 flex justify-center items-center w-full max-w-[180px] sm:max-w-[180px] lg:max-w-[200px] hover:scale-110 duration-200 ease-in-out">
      <div className="flex flex-col items-center gap-4">
        <h3
          className={`font-black text-2xl text-wrap w-[70%] text-center sm:text-4xl lg:text-5xl ${brotherFont.className}`}
        >
          {ticket.name || ''}
        </h3>
        <p className="text-sm text-center flex flex-col sm:text-lg">
          IDR{' '}
          <span className="text-lg font-black sm:text-xl">
            {formattedPrice(ticket.price)}
          </span>
        </p>
        <Link
          href={`/checkout/event/${idEvent}`}
          className="p-[1px] rounded-sm bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
        >
          <div className="rounded-sm font-semibold bg-secondary text-center text-xs py-2 px-4 sm:text-sm">
            BUY TICKETS
          </div>
        </Link>
      </div>
    </div>
  );
}
