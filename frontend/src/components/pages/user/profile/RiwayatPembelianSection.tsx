'use client';

import { fetchTransactionById } from '@/app/api/transcation';
import Label from '@/components/fragments/label/Label';
import { useAuth } from '@/context/authUserContext';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { ITransaction } from '@/types/Transaction';
import { formattedDate } from '@/utils/universalUtils';
import { useEffect, useState } from 'react';

export default function RiwayatPembelian() {
  const dataOwnerMelo = {
    name: 'M MAULANA RIDWAN',
    accountNumber: '1707071717',
  };

  const { authUser } = useAuth();
  const [transactionData, setTransactionData] = useState<ITransaction | null>(
    null
  );

  const getTransactionById = async () => {
    try {
      const idTransaction = authUser?.historyTransaction?.at(-1);
      if (!idTransaction) return;

      const response = await fetchTransactionById(idTransaction);
      if (response.status == 'success' && response.data) {
        console.log(response.data);
        setTransactionData(response.data);
      } else {
        ToastError(response.message);
      }
    } catch (error: any) {
      ToastError(error.message);
    }
  };

  useEffect(() => {
    getTransactionById();
  }, [authUser]);

  return (
    <section className="flex flex-col md:flex-1">
      <Label text="RIWAYAT PEMBELIAN" />
      <div className="w-full bg-secondary p-4 rounded-lg flex flex-col mt-4">
        <div className="grid grid-cols-2 gap-2 text-black">
          <p className="bg-white font-bold text-sm lg:text-lg py-2 px-4 flex items-center">
            Nomor Rekening
          </p>
          <p className="bg-white font-normal text-sm lg:text-lg py-2 px-4 flex items-center">
            8205353324 Bank Central Asia / IDR
          </p>

          <p className="bg-white font-bold text-sm lg:text-lg py-2 px-4 flex items-center">
            Nomor Rekening Tujuan
          </p>
          <p className="bg-white font-normal text-sm lg:text-lg py-2 px-4 flex items-center">
            {dataOwnerMelo?.accountNumber || ''}
          </p>

          <p className="bg-white font-bold text-sm lg:text-lg py-2 px-4 flex items-center">
            Nama Pemilik Rekening Tujuan
          </p>
          <p className="bg-white font-normal text-sm lg:text-lg py-2 px-4 flex items-center">
            {dataOwnerMelo?.name || ''}
          </p>

          <p className="bg-white font-bold text-sm lg:text-lg py-2 px-4 flex items-center">
            Jumlah Transfer
          </p>
          <p className="bg-white font-normal text-sm lg:text-lg py-2 px-4 flex items-center">
            {transactionData?.totalPrice || 0}
          </p>

          <p className="bg-white font-bold text-sm lg:text-lg py-2 px-4 flex items-center">
            Tanggal Transfer
          </p>
          <p className="bg-white font-normal text-sm lg:text-lg py-2 px-4 flex items-center">
            {formattedDate(transactionData?.createdAt || '')}
          </p>

          <p className="bg-white font-bold text-sm lg:text-lg py-2 px-4 flex items-center">
            Jumlah Tiket
          </p>
          <p className="bg-white font-normal text-sm lg:text-lg py-2 px-4 flex items-center">
            {transactionData?.totalTicket || 0}
          </p>
        </div>
        <p className="italic font-normal text-xs px-4 mt-4 md:text-sm">
          Transaksi anda telah di terima oleh pihak promotor. Harap simpan dan
          jaga keamanan profile kamu!
        </p>
      </div>
    </section>
  );
}
