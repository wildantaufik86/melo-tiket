'use client';

import TicketCard from '@/components/fragments/card/TicketCard';
import Label from '@/components/fragments/label/Label';
import { IEvent } from '@/types/Event';
import { Orders, useOrder } from '@/context/ordersContext';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

// import swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import localFont from 'next/font/local';

const brotherFont = localFont({
  src: '../../../../public/fonts/BROTHER-Bold.otf',
  display: 'swap',
});

// 1. Terima 'event' sebagai prop, bukan lagi mengambilnya dari state
export default function TicketSection({ event }: { event: IEvent | null }) {
  // 2. Hapus state 'event' dan 'loading'. Hanya 'availableTickets' yang dibutuhkan
  const [availableTickets, setAvailableTickets] = useState<Orders[]>([]);
  const { saveOrders } = useOrder();

  const handleOrder = useCallback(
    (idTicket: string) => {
      const filtered = availableTickets
        .filter((tc) => tc._id === idTicket)
        .map((tc) => ({ ...tc, quantity: 1, isOpen: true }));
      saveOrders(filtered);
    },
    [availableTickets, saveOrders]
  );

  // 3. useEffect ini sekarang hanya bertugas memproses prop 'event' menjadi state 'availableTickets'
  useEffect(() => {
    if (event && event.tickets) {
      const initialTickets: Orders[] = event.tickets.map((tc) => ({
        ...tc,
        quantity: 0,
        isOpen: false,
      }));
      setAvailableTickets(initialTickets);
    }
  }, [event]); // <-- Bergantung pada prop 'event'

  // 4. Ganti 'if (loading)' dengan 'if (!event)'. Ini akan menangani kasus jika data gagal diambil di server.
  if (!event) {
    // Anda bisa menampilkan pesan atau komponen skeleton loading di sini
    return (
      <section className="text-center py-20">
        <h2 className="text-2xl">Memuat data event...</h2>
      </section>
    );
  }

  return (
    <section className="relative flex flex-col items-center py-[28%]">
      <h2
        className={`z-10 text-2xl mb-2 font-bold text-center w-[40%] text-wrap font-brother sm:text-4xl md:text-5xl lg:text-7xl ${brotherFont.className}`}
      >
        {/* Gunakan data 'event' dari props */}
        {event.eventName}
      </h2>

      <Label text="GET YOUR TICKET NOW" />
      <div className="absolute inset-0 top-15 mt-32">
        <div className="relative flex justify-center items-center pb-12 aspect-[1/1]">
          <Image
            src="/images/awan.webp"
            alt="Cloud background"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
            quality={60}
          />
          <div className="w-full px-4 lg:px-12 lg:mt-12">
            <Swiper
              key={availableTickets.length}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 2 },
                430: { slidesPerView: 2.5 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
            >
              {availableTickets.map((tc) => (
                <SwiperSlide key={tc._id}>
                  <TicketCard
                    ticket={tc}
                    handleOrder={handleOrder}
                    idEvent={event._id}
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
