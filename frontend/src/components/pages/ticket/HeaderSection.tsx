import { IEvent } from '@/types/Event';
import { formattedDate } from '@/utils/universalUtils';
import { FaCalendar } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { RiInstagramFill } from 'react-icons/ri';
import Link from 'next/link';

type Props = {
  event?: IEvent;
};

export default function HeaderSection({ event }: Props) {
  return (
    <section className="flex flex-col mt-[27%] pd-lr gap-4">
      <h2 className="text-xl font-black lg:text-[50px]">
        {event?.eventName || 'MELOPHILE FESTIVAL Vol 2'}
      </h2>
      <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm lg:text-2xl font-semibold ">
        <p className="flex items-center gap-1 ">
          <FaLocationDot />
          {event?.address || 'tidak ada lokasi'}
        </p>
        <p className="flex items-center gap-1">
          <FaCalendar />
          {formattedDate(event?.date || '') || 'tidak ada tanggal'}
        </p>
        <Link
          href="https://www.instagram.com/melofest.id?igsh=dGtrYXg1dmZpNHBu"
          className="flex items-center gap-1"
        >
          <RiInstagramFill />
          <span className="text-[#FEBC2F]">melofest.id</span>
        </Link>
      </div>
      <div className="bg-white w-full h-[2px]"></div>
    </section>
  );
}
