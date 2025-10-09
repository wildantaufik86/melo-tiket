'use client';

import { fetchEventById } from '@/app/api/event';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { IEvent } from '@/types/Event';
import { ITicket } from '@/types/Ticket';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import HeaderSection from '../ticket/HeaderSection';
import { formattedDate } from '@/utils/universalUtils';
import { RiInstagramFill } from 'react-icons/ri';
import { FaCalendar } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

export default function VenueSection() {
  const id = '6899f694bbde0daae146f849';
  const [eventDetail, setEventDetail] = useState<{
    event: IEvent;
    tickets: ITicket[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const getDetailEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchEventById(id);
      if (response.status == 'success' && response.data) {
        setEventDetail(response.data);
      } else {
        ToastError(response.message);
      }
    } catch (err: any) {
      ToastError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getDetailEvent();
    }
  }, [id, getDetailEvent]);

  if (loading) return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-black lg:text-[50px]">
          {eventDetail?.event?.eventName || 'MELOPHILE FESTIVAL Vol 2'}
        </h2>
        <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm lg:text-2xl font-semibold ">
          <p className="flex items-center gap-1 ">
            <FaLocationDot />
            {eventDetail?.event?.address || 'tidak ada lokasi'}
          </p>
          <p className="flex items-center gap-1">
            <FaCalendar />
            {formattedDate(eventDetail?.event?.date || '') ||
              'tidak ada tanggal'}
          </p>
          <p className="flex items-center gap-1">
            <RiInstagramFill />
            <span className="text-[#FEBC2F]">melofest.id</span>
          </p>
        </div>
        <div className="bg-white w-full h-[2px]"></div>
      </div>
      <div className="relative aspect-1/1 mt-16">
        <Image
          src="/images/panel-ticket-venue.webp"
          alt="Venue"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
