import { TicketCardProps } from '@/types/Ticket';
import { formattedPrice } from '@/utils/universalUtils';
import { FaChevronDown } from 'react-icons/fa';

export default function TickedAccordion({
  ticket,
  toggleOpen,
  decrementQty,
  incrementQty,
}: TicketCardProps) {
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
}
