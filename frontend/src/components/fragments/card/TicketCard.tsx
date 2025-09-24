import { formattedPrice } from '@/utils/universalUtils';
import Link from 'next/link';

type TicketCard = {
  id: number;
  title: string;
  price: number;
};

type TicketCardProps = {
  ticket: TicketCard;
  idEvent?: string;
};

export default function TicketCard({ ticket, idEvent }: TicketCardProps) {
  return (
    <div className="bg-[url(/images/bg-ticket.webp)] bg-contain bg-center bg-no-repeat aspect-2/3 flex justify-center items-center w-full max-w-[150px] md:max-w-[180px] lg:max-w-[200px] hover:scale-110 duration-200 ease-in-out">
      <div className="flex flex-col items-center gap-4 py-4">
        <h3 className="font-semibold text-lg text-wrap w-[70%] text-center lg:text-3xl">
          {ticket.title}
        </h3>
        <p className="text-xs text-center flex flex-col lg:text-sm">
          IDR{' '}
          <span className="text-sm font-semibold lg:text-lg">
            {formattedPrice(ticket.price)}
          </span>
        </p>
        <Link
          href={`/ticket/event/${idEvent}`}
          className="p-[1px] rounded-sm bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
        >
          <div className="rounded-sm bg-secondary text-center text-xs py-2 px-4 lg:text-sm">
            BUY TICKETS
          </div>
        </Link>
      </div>
    </div>
  );
}
