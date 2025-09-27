'use client';

import { fetchTransactionById } from '@/app/api/transcation';
import Label from '@/components/fragments/label/Label';
import { useAuth } from '@/context/authUserContext';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { ITransaction } from '@/types/Transaction';
import { formattedDate } from '@/utils/universalUtils';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';

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
          <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
            Nomor Rekening
          </p>
          <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
            8205353324 Bank Central Asia / IDR
          </p>

          <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
            Nomor Rekening Tujuan
          </p>
          <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
            {dataOwnerMelo?.accountNumber || ''}
          </p>

          <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
            Nama Pemilik Rekening Tujuan
          </p>
          <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
            {dataOwnerMelo?.name || ''}
          </p>
        </div>
        <div className="border border-white mt-4 p-4">
          <p className="text-xs flex items-center gap-2 md:text-sm lg:text-base">
            <FaCircleInfo />
            Kamu tidak memiliki riwayat pembelian
          </p>
        </div>
        {/* <div className="w-full flex flex-col mt-4 p-4 border border-white rounded-sm">
          <div className="flex justify-between border-b border-b-slate-500 mb-2 pb-2">
            <p>history transaction</p>
            <FaChevronDown />
          </div>
          <div className=" text-black w-full py-2 grid grid-cols-2 gap-2">
            <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
              Jumlah Transfer
            </p>
            <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
              {transactionData?.totalPrice || 0}
            </p>

            <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
              Tanggal Transfer
            </p>
            <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
              {formattedDate(transactionData?.createdAt || '')}
            </p>

            <p className="bg-white font-bold text-sm lg:text-base py-2 px-4 flex items-center">
              Jumlah Tiket
            </p>
            <p className="bg-white font-normal text-sm lg:text-base py-2 px-4 flex items-center">
              {transactionData?.totalTicket || 0}
            </p>
          </div>
        </div> */}
        <p className="italic font-normal text-xs px-4 mt-4 md:text-sm">
          Transaksi anda telah di terima oleh pihak promotor. Harap simpan dan
          jaga keamanan profile kamu!
        </p>
      </div>
    </section>
  );
}
