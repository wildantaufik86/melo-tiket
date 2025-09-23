'use client';

// import { fetchEvent } from '@/app/api/event';
import Label from '@/components/fragments/label/Label';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { IEvent } from '@/types/Event';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function TicketSection() {
  const [event, setEvent] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const getEvent = useCallback(async () => {
    setLoading(true);
    // try {
    //   const response = await fetchEvent();
    //   if (response.status == 'success' && response.data) {
    //     setEvent(response.data as unknown as IEvent[]);
    //   } else {
    //     ToastError(response.message);
    //   }
    // } catch (err: any) {
    //   ToastError(err.message);
    // } finally {
    //   setLoading(false);
    // }
  }, []);

  useEffect(() => {
    getEvent();
  }, [getEvent]);
  console.log('Result Data TEsting: ', event);
  return (
    <section className="relative flex flex-col items-center py-[28%]">
      {/* Judul */}
      <h2 className="z-10 text-xl font-semibold text-center w-[50%]  md:text-3xl lg:text-5xl">
        Melophile Festival Vol 2
      </h2>

      {/* Label */}
      <Label text="GET YOUR TICKET NOW" />

      <div className="absolute inset-0 top-15 mt-16">
        <div className="flex justify-center items-center pb-12 bg-[url(/images/awan.png)] bg-cover bg-no-repeat bg-center aspect-square">
          {/* Grid tiket */}
          <div className="grid grid-cols-5 justify-items-center mt-4 w-full max-w-5xl lg:gap-8">
            <Link
              href="/ticket/vip"
              className="relative w-full max-w-[600px] aspect-square lg:aspect-1/2"
            >
              <Image
                src="/images/VIP.png"
                alt="VIP Ticket"
                fill
                className="object-contain hover:scale-110 duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="/ticket/vip-tribun"
              className="relative w-full max-w-[600px] aspect-square lg:aspect-1/2"
            >
              <Image
                src="/images/vip-tribun.png"
                alt="VIP Ticket"
                fill
                className="object-contain hover:scale-110 duration-300 ease-in-out"
              />
            </Link>

            <Link
              href="/ticket/festival-a"
              className="relative w-full max-w-[600px] aspect-square lg:aspect-1/2"
            >
              <Image
                src="/images/fest-a.png"
                alt="Festival A Ticket"
                fill
                className="object-contain hover:scale-115 duration-500 ease-in-out"
              />
            </Link>

            <Link
              href="/ticket/festival-b"
              className="relative w-full max-w-[600px] aspect-square lg:aspect-1/2"
            >
              <Image
                src="/images/fest-b.png"
                alt="Festival B Ticket"
                fill
                className="object-contain hover:scale-110 duration-300 ease-in-out"
              />
            </Link>

            <Link
              href="/ticket/tribun"
              className="relative w-full max-w-[600px] aspect-square lg:aspect-1/2"
            >
              <Image
                src="/images/TRIBUN.png"
                alt="Tribun Ticket"
                fill
                className="object-contain hover:scale-110 duration-300 ease-in-out"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
