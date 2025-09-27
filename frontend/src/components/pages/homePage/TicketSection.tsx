'use client';

import { fetchEventById } from '@/app/api/event';
import TicketCard from '@/components/fragments/card/TicketCard';
import Label from '@/components/fragments/label/Label';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { IEvent } from '@/types/Event';
import { Orders, useOrder } from '@/context/ordersContext';
import { useCallback, useEffect, useState } from 'react';

// import swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function TicketSection() {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTickets, setAvailableTickets] = useState<Orders[]>([]);
  const { saveOrders } = useOrder();

  const getEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchEventById('6899f694bbde0daae146f849');
      if (response.status == 'success' && response.data) {
        const combinedData: IEvent = {
          ...response.data.event,
          tickets: response.data.tickets,
        };
        setEvent(combinedData);
      } else {
        ToastError(response.message);
      }
    } catch (err: any) {
      ToastError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOrder = (idTicket: string) => {
    const filtered = availableTickets
      .filter((tc) => tc._id === idTicket)
      .map((tc) => ({ ...tc, quantity: 1, isOpen: true }));
    saveOrders(filtered);
  };

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  useEffect(() => {
    if (event && event.tickets) {
      const filteredTicket: Orders[] = event.tickets
        .filter((tc) => tc.status === 'Available')
        .map((tc) => ({ ...tc, quantity: 0, isOpen: false }));
      setAvailableTickets(filteredTicket);
    }
  }, [event]);

  if (loading) return null;

  return (
    <section className="relative flex flex-col items-center py-[28%]">
      <h2 className="z-10 text-xl font-bold text-center w-[50%] font-brother md:text-3xl lg:text-6xl">
        {event?.eventName || 'Melophile Festival Vol 2'}
      </h2>

      <Label text="GET YOUR TICKET NOW" />

      <div className="absolute inset-0 top-15 mt-32">
        <div className="flex justify-center items-center pb-12 bg-[url(/images/awan.png)] bg-cover bg-no-repeat bg-center aspect-square">
          <div className="w-full px-4 lg:px-12 mt-[25%] lg:mt-0">
            <Swiper
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 3 }, // mobile: 3
                1024: { slidesPerView: 5 }, // laptop: 5
              }}
            >
              {availableTickets.length > 0 &&
                availableTickets.map((tc) => (
                  <SwiperSlide key={tc._id}>
                    <TicketCard
                      ticket={tc}
                      handleOrder={handleOrder}
                      idEvent={event?._id}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
