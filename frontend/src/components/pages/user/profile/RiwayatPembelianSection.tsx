'use client';

import HistoryTransactionAccordion from '@/components/fragments/accordion/HistoryTransactionAccordion';
import Label from '@/components/fragments/label/Label';
import { useAuth } from '@/context/authUserContext';
import { ITransaction } from '@/types/Transaction';
import { FaCircleInfo } from 'react-icons/fa6';

type PropsRiwayatPembelian = {
  historyTransactions: ITransaction[];
};

export default function RiwayatPembelian({
  historyTransactions,
}: PropsRiwayatPembelian) {
  const dataOwnerMelo = {
    name: 'M MAULANA RIDWAN',
    accountNumber: '0722171717',
  };

  const { authUser } = useAuth();

  return (
    <section className="flex flex-col md:flex-1">
      <Label text="RIWAYAT PEMBELIAN" />
      <div className="w-full bg-bg-secondary p-4 rounded-lg flex flex-col mt-4">
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

        <div className="flex flex-col max-h-[200px] overflow-auto">
          {historyTransactions?.length > 0 ? (
            historyTransactions.map((data) => (
              <HistoryTransactionAccordion
                key={data._id}
                totalPrice={data.totalPrice}
                createdAt={data.createdAt || ''}
                totalTicket={data.totalTicket}
              />
            ))
          ) : (
            <div className="border border-white mt-4 p-4">
              <p className="text-xs flex items-center gap-2 md:text-sm lg:text-base">
                <FaCircleInfo />
                Kamu tidak memiliki riwayat pembelian
              </p>
            </div>
          )}
        </div>
        <p className="italic font-normal text-xs px-4 mt-4 md:text-sm">
          Transaksi anda telah di terima oleh pihak promotor. Harap simpan dan
          jaga keamanan profile kamu!
        </p>
      </div>
    </section>
  );
}
