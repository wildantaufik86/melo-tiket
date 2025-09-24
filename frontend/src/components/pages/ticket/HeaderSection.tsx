import { IEvent } from '@/types/Event';
import { formattedDate } from '@/utils/universalUtils';
import { CiLocationOn } from 'react-icons/ci';
import { FaInstagram } from 'react-icons/fa';
import { MdOutlineDateRange } from 'react-icons/md';

type Props = {
  event?: IEvent;
};

export default function HeaderSection({ event }: Props) {
  return (
    <section className="flex flex-col mt-[27%] pd-lr gap-4">
      <h2 className="text-xl font-semibold">
        {event?.eventName || 'MELOPHILE FESTIVAL Vol 2'}
      </h2>
      <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm ">
        <p className="flex items-center gap-1 ">
          <CiLocationOn />
          {event?.address || 'tidak ada lokasi'}
        </p>
        <p className="flex items-center gap-1">
          <MdOutlineDateRange />
          {formattedDate(event?.date || '') || 'tidak ada tanggal'}
        </p>
        <p className="flex items-center gap-1">
          <FaInstagram />
          <span className="text-[#FEBC2F]">melofest.id</span>
        </p>
      </div>
      <div className="bg-white w-full h-[2px]"></div>
    </section>
  );
}
