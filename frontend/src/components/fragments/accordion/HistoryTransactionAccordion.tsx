import { formattedDate } from '@/utils/universalUtils';
import { FaChevronDown } from 'react-icons/fa';

type PropsHistoryAccordion = {
  totalPrice: number;
  createdAt: string | Date;
  totalTicket: number;
};

export default function HistoryTransactionAccordion({
  totalPrice,
  createdAt,
  totalTicket,
}: PropsHistoryAccordion) {
  return (
    <details className="w-full flex flex-col mt-4 border border-white rounded-sm">
      <summary className="flex justify-between cursor-pointer border-b border-b-slate-500 mb-2 pb-2 px-4 py-2 items-center">
        <span>History Transaction</span>
        <FaChevronDown className="transition-transform duration-200 ease-in-out group-open:rotate-180" />
      </summary>

      <div className="text-black w-full py-2 grid grid-cols-2 gap-2 px-4">
        <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
          Jumlah Transfer
        </p>
        <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
          {totalPrice || 0}
        </p>

        <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
          Tanggal Transfer
        </p>
        <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
          {formattedDate(createdAt || '')}
        </p>

        <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
          Jumlah Tiket
        </p>
        <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
          {totalTicket || 0}
        </p>
      </div>
    </details>
  );
}
