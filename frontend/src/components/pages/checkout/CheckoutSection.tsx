'use client';

import { formattedPrice } from '@/utils/universalUtils';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

type Props = {
  listOrder: [] | any;
};

export default function CheckoutSection({ listOrder }: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const subTotal = listOrder?.reduce(
    (acc, data) => acc + data.price * data.quantity,
    0
  );
  const platformFee = 0;
  const total = subTotal + platformFee;

  const toggleConfirm = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setIsConfirmed(target.checked);
  };

  return (
    <section className="flex flex-col mt-8 md:flex-1 md:mt-0 md:max-h-[200px]">
      <div className="flex-1 flex flex-col gap-2 bg-secondary p-4 rounded-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-sm">{formattedPrice(subTotal)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm flex flex-col">
            Platform Fee
            <span className="text-[10px] opacity-50">Non Refundable</span>
          </p>
          <p className="text-sm">
            {platformFee === 0 ? 'Gratis' : platformFee}
          </p>
        </div>

        {/* hr */}
        <div className="w-full h-[1px] bg-white"></div>

        <div className="flex items-center justify-between">
          <p className="text-sm flex flex-col font-semibold">
            TOTAL :
            <span className="text-[10px] opacity-50">
              Pembayaran ini sudah termasuk pajak
            </span>
          </p>
          <p className="text-sm">{formattedPrice(total)}</p>
        </div>
      </div>

      {/* konfirm input */}
      <div className="flex items-center gap-2 px-4 mt-4 cursor-pointer">
        <input type="checkbox" id="confirm" onChange={toggleConfirm} />
        <label htmlFor="confirm" className="text-xs">
          Dengan ini saya setuju dengan{' '}
          <Link
            href="/terms"
            className="text-red-500 hover:underline duration-100"
          >
            Syarat & Ketentuan
          </Link>{' '}
          yang berlaku
        </label>
      </div>

      <div
        className={`w-full py-2 mt-4 bg-secondary rounded-full flex justify-center items-center ${
          isConfirmed ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        Konfirmasi Pembelian
      </div>
    </section>
  );
}
