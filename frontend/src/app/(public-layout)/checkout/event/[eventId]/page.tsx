'use client';

import { ICreateTransactionPayload } from '@/app/api/transcation';
import CheckoutSection from '@/components/pages/checkout/CheckoutSection';
import DetailOrderSection from '@/components/pages/checkout/DetailOrderSection';
import { Orders, useOrder } from '@/context/ordersContext';
import { useEffect, useState } from 'react';

export default function TicketPage() {
  const [ordersTicket, setOrdersTicket] = useState<Orders[]>([]);
  const { orders, getOrders } = useOrder();

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [payload, setPayload] = useState<ICreateTransactionPayload | null>(
    null
  );

  const handlePaymentProof = (fileParam: File) => {
    setPaymentProof(fileParam);
  };

  const incrementQty = (id?: string) => {
    setOrdersTicket((prev) =>
      prev.map((t) =>
        t._id === id && t.quantity < 4 ? { ...t, quantity: t.quantity + 1 } : t
      )
    );
  };

  const decrementQty = (id?: string) => {
    setOrdersTicket((prev) =>
      prev.map((t) =>
        t._id === id && t.quantity > 0 ? { ...t, quantity: t.quantity - 1 } : t
      )
    );
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (orders && orders?.length > 0) {
      setOrdersTicket(orders);
    }
  }, [orders]);

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
          <CheckoutSection
            listOrder={ordersTicket}
            payload={payload!}
            incrementQty={incrementQty}
            decrementQty={decrementQty}
          />
        </div>
      </div>
    </section>
  );
}
