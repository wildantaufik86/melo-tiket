'use client';

import CheckoutSection from '@/components/pages/checkout/CheckoutSection';
import DetailOrderSection from '@/components/pages/checkout/DetailOrderSection';
import { ITicket } from '@/types/Ticket';
import { getLocalStorage } from '@/utils/clientUtils';
import { useEffect, useState } from 'react';

type TicketWithState = ITicket & {
  quantity: number;
  isOpen: boolean;
  name: string;
  idTicket: number;
};

export default function TicketPage() {
  const [ordersTicket, setOrdersTicket] = useState<TicketWithState[]>([]);

  const getOrder = () => {
    const data: any = getLocalStorage('order');
    if (data.length > 0) {
      setOrdersTicket(data);
    }
  };

  console.log(ordersTicket);

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <section className="bg-[url(/images/dark-gradient.jpg)] bg-cover bg-center bg-no-repeat min-h-screen pt-20">
      <div className="pd-full flex flex-col">
        <h3 className="text-lg font-black md:text-xl lg:text-5xl">
          RINCIAN PESANAN
        </h3>
        <div className="flex flex-col mt-8 md:flex-row md:gap-6">
          <DetailOrderSection orders={ordersTicket} />
          <CheckoutSection listOrder={ordersTicket} />
        </div>
      </div>
    </section>
  );
}
