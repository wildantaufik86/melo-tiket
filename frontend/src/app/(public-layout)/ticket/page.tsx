'use client';

import { fetchEventById } from '@/app/api/event';
import HeroSection from '@/components/pages/homePage/HeroSection';
import AboutSection from '@/components/pages/ticket/AboutSection';
import HeaderSection from '@/components/pages/ticket/HeaderSection';
import ListTicketSection from '@/components/pages/ticket/ListTicketSection';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { IEvent } from '@/types/Event';
import { ITicket } from '@/types/Ticket';
import React, { useCallback, useEffect, useState } from 'react';

export default function TicketPage() {
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
    <section className="bg-[url(/images/dark-gradient.webp)] bg-cover bg-center bg-no-repeat min-h-screen pt-32">
      <div className="relative flex flex-col">
        <HeroSection />
        <HeaderSection event={eventDetail?.event} />
      </div>
      <div className="flex flex-col mt-8 pd-full md:flex-row md:gap-6 lg:gap-12">
        <AboutSection eventDetail={eventDetail?.event} />
        <ListTicketSection tickets={eventDetail?.tickets || []} eventId={id} />
      </div>
    </section>
  );
}
