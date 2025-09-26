'use client';

import { ICreateTransactionPayload } from '@/app/api/transcation';
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
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [payload, setPayload] = useState<ICreateTransactionPayload | null>(
    null
  );

  const handlePaymentProof = (fileParam: File) => {
    setPaymentProof(fileParam);
  };

  const getOrder = () => {
    const data: any = getLocalStorage('order');
    if (data?.length > 0) {
      setOrdersTicket(data);
    }
  };

  console.log('payload', payload);

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    if (ordersTicket) {
      const combineData: ICreateTransactionPayload = {
        tickets: ordersTicket.map((order) => ({
          ticketId: order._id!,
          quantity: order.quantity,
        })),
        transactionMethod: 'Online',
        paymentProof,
      };

      setPayload(combineData);
    }
  }, [ordersTicket, paymentProof]);

  return (
    <section className="bg-[url(/images/dark-gradient.jpg)] bg-cover bg-center bg-no-repeat min-h-screen pt-20">
      <div className="pd-full flex flex-col">
        <h3 className="text-lg font-black md:text-xl lg:text-5xl">
          RINCIAN PESANAN
        </h3>
        <div className="flex flex-col mt-8 md:flex-row md:gap-6">
          <DetailOrderSection
            orders={ordersTicket}
            handlePaymentProof={handlePaymentProof}
          />
          <CheckoutSection listOrder={ordersTicket} payload={payload!} />
        </div>
      </div>
    </section>
  );
}
