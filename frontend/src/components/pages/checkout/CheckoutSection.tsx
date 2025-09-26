'use client';

import {
  createTransaction,
  ICreateTransactionPayload,
} from '@/app/api/transcation';
import {
  ToastError,
  ToastSuccess,
} from '@/lib/validations/toast/ToastNofication';
import { deleteLocalStorage } from '@/utils/clientUtils';
import { formattedPrice } from '@/utils/universalUtils';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';

interface IOrderItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

type Props = {
  listOrder: IOrderItem[];
  payload: ICreateTransactionPayload;
};

export default function CheckoutSection({ listOrder, payload }: Props) {
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

  const clearOrderData = () => {
    return deleteLocalStorage('order');
  };

  const handleCreateTransaction = async () => {
    try {
      if (payload && payload?.tickets.length === 0) {
        ToastError('Please orders ticket first');
        return;
      }

      if (payload && !payload?.paymentProof) {
        ToastError('Please upload proof of payment');
        return;
      }

      const response = await createTransaction(payload);
      if (response.status == 'success' && response.data) {
        ToastSuccess(response.message);
        clearOrderData();
      } else {
        ToastError(response.message);
      }
    } catch (err: any) {
      ToastError(err.message);
    }
  };

  return (
    <section className="flex flex-col mt-8 md:flex-1 md:mt-0 md:max-h-[200px]">
      <div className="flex-1 flex flex-col gap-2 bg-secondary p-4 rounded-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm lg:text-xl font-medium">Subtotal</p>
          <p className="text-sm lg:text-xl font-medium">
            {formattedPrice(subTotal)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm flex flex-col lg:text-xl font-medium">
            Platform Fee
            <span className="text-[10px] opacity-50 lg:text-xs font-medium">
              Non Refundable
            </span>
          </p>
          <p className="text-sm lg:text-xl font-medium">
            {platformFee === 0 ? 'Gratis' : platformFee}
          </p>
        </div>

        {/* hr */}
        <div className="w-full h-[1px] bg-white"></div>

        <div className="flex items-center justify-between">
          <p className="text-sm flex flex-col lg:text-xl font-bold">
            TOTAL :
            <span className="text-[10px] opacity-50 lg:text-xs font-medium">
              Pembayaran ini sudah termasuk pajak
            </span>
          </p>
          <p className="text-sm lg:text-xl font-bold">
            {formattedPrice(total)}
          </p>
        </div>
      </div>

      {/* konfirm input */}
      <div className="flex items-center gap-2 px-4 mt-4 cursor-pointer">
        <input type="checkbox" id="confirm" onChange={toggleConfirm} />
        <label htmlFor="confirm" className="text-xs lg:text-sm font-bold">
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
        onClick={handleCreateTransaction}
        className={`w-full py-2 mt-4 bg-secondary rounded-full flex justify-center items-center ${
          isConfirmed ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        <span className="text-sm lg:text-xl font-bold">
          Konfirmasi Pembelian
        </span>
      </div>
    </section>
  );
}
