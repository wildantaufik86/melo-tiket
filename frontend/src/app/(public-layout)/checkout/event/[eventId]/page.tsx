'use client';

import { useEffect, useState } from 'react';
import { ICreateTransactionPayload } from '@/app/api/transcation';
import CheckoutSection from '@/components/pages/checkout/CheckoutSection';
import DetailOrderSection from '@/components/pages/checkout/DetailOrderSection';
import { Orders, useOrder } from '@/context/ordersContext';
import { generate3Digit } from '@/utils/universalUtils';

export default function TicketPage() {
  const [ordersTicket, setOrdersTicket] = useState<Orders[]>([]);
  const { orders, getOrders } = useOrder();

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [payload, setPayload] = useState<ICreateTransactionPayload | null>(
    null
  );
  const [codeUnique, setCodeUnique] = useState<number>(0);

  const platformFee: number = 5000;

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

  // Ambil orders dari context saat component mount
  useEffect(() => {
    getOrders();
  }, []);

  // Set orders dari context
  useEffect(() => {
    if (orders && orders.length > 0) {
      setOrdersTicket(orders);
    }
  }, [orders]);

  // Hitung total + kode unik
  useEffect(() => {
    const totalTicket = ordersTicket.reduce((acc, t) => acc + t.quantity, 0);
    const subTotal = ordersTicket.reduce(
      (acc, t) => acc + t.price * t.quantity,
      0
    );

    let newCodeUnique = codeUnique;
    if (totalTicket > 0 && codeUnique === 0) {
      newCodeUnique = Number(generate3Digit());
      setCodeUnique(newCodeUnique);
    } else if (totalTicket === 0) {
      newCodeUnique = 0;
      setCodeUnique(0);
    }

    const newTotal = subTotal + platformFee * totalTicket + newCodeUnique;

    // Update payload otomatis
    const combineData: ICreateTransactionPayload = {
      tickets: ordersTicket.map((order) => ({
        ticketId: order._id!,
        quantity: order.quantity,
      })),
      transactionMethod: 'Online',
      paymentProof,
      totalPrice: newTotal,
    };
    setPayload(combineData);
  }, [ordersTicket, paymentProof]);

  return (
    <section className="w-full bg-dark-gradient min-h-screen pt-20 overflow-x-hidden">
      <div className="pd-full flex flex-col">
        <h3 className="text-lg font-black md:text-xl lg:text-5xl">
          RINCIAN PESANAN
        </h3>
        <div className="flex flex-col mt-8 md:flex-row md:gap-6">
          <DetailOrderSection
            orders={ordersTicket}
            handlePaymentProof={handlePaymentProof}
          />
          {payload && (
            <CheckoutSection
              listOrder={ordersTicket}
              payload={payload}
              incrementQty={incrementQty}
              decrementQty={decrementQty}
            />
          )}
        </div>
      </div>
    </section>
  );
}
