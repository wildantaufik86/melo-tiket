'use client';

import { fetchEventById } from '@/app/api/event';
import { useAuth } from '@/context/authUserContext';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { IEvent } from '@/types/Event';
import {
  formattedDate,
  formattedPrice,
  parseDateOfBirth,
} from '@/utils/universalUtils';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';

interface IOrderItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

type OrderProps = {
  orders: IOrderItem[];
  handlePaymentProof: (file: File) => void;
};

export default function DetailOrderSection({
  orders,
  handlePaymentProof,
}: OrderProps) {
  const { authUser } = useAuth();
  const { day, month, year } = parseDateOfBirth(authUser?.profile?.dateOfBirth);

  const id = '6899f694bbde0daae146f849';
  const [eventDetail, setEventDetail] = useState<{
    event: IEvent;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const getDetailEvent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchEventById(id);
      if (response.status == 'success' && response.data) {
        setEventDetail(response.data);
      } else {
        ToastError(response.message);
      }
    } catch (err: any) {
      ToastError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getDetailEvent();
    }
  }, [id, getDetailEvent]);

  if (loading) return null;

  return (
    <section className="flex flex-col md:w-[60%] lg:w-[55%]">
      {/* detail order */}
      <div className="flex-1 flex flex-col bg-bg-secondary p-4 rounded-sm">
        {/* header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative w-full aspect-3/1 md:aspect-3/2 md:w-1/2 lg:h-[140px]">
            <Image
              src="/images/post-dewa-panel-2-1.png"
              alt="event image"
              fill
              className="object-contain object-top md:object-center"
            />
          </div>
          <div className="w-full flex flex-col gap-4 md:flex-1 ">
            <h4 className="text-sm font-black md:text-lg lg:text-2xl">
              {eventDetail?.event?.eventName || 'MELOPHILE FESTIVAL'}
            </h4>
            <div className="flex items-center justify-between md:flex-col md:items-start">
              <p className="text-[10px] lg:text-base">
                Tanggal :{' '}
                {eventDetail?.event?.date
                  ? formattedDate(eventDetail?.event.date)
                  : ''}
              </p>
              <p className="text-[10px] lg:text-base">
                Tempat : {eventDetail?.event?.address || ''}
              </p>
            </div>
          </div>
        </div>

        {/* hr */}
        <div className="w-full bg-white h-[2px] mt-4 opacity-80"></div>

        {/* list order ticket */}
        <div className="flex flex-col gap-4 mt-4 max-h-[200px] overflow-auto">
          {orders &&
            orders.map((ticket, index) => (
              <div key={index} className="flex flex-col">
                <h4 className="text-lg font-black lg:text-2xl">
                  {ticket.name}
                </h4>
                <div className="grid grid-cols-2 text-[10px] opacity-80 lg:text-lg font-medium">
                  <p>Harga Ticket </p>
                  <p className="text-left">: {formattedPrice(ticket.price)}</p>
                  <p className="">Jumlah </p>
                  <p>: {ticket.quantity} pcs</p>
                  <p className="">Total </p>
                  <p>: {formattedPrice(ticket.price * ticket.quantity)} </p>
                </div>
              </div>
            ))}
        </div>

        {/* hr */}
        <div className="w-full bg-white h-[2px] mt-4 opacity-80"></div>

        {/* bank information */}
        <div className="flex gap-4 mt-4 p-4">
          <div className="relative w-[25%]">
            <Image
              src="/images/bca-syariah.png"
              alt="Bank_BCA_Syariah_logo"
              fill
              className="object-contain object-left"
            />
          </div>
          <div className="flex-1 grid grid-cols-[1fr_auto] gap-4">
            <p className="text-[10px] md:text-sm lg:text-base font-bold">
              Nama Rekening
            </p>
            <p className="text-[10px] md:text-sm lg:text-base">
              : M. MAULANA RIDWAN
            </p>
            <p className="text-[10px] md:text-sm lg:text-base font-bold">
              Nomor Rekening
            </p>
            <p className="text-[10px] md:text-sm lg:text-base">: 0722171717</p>
          </div>
        </div>
      </div>

      {/* detail pembeli */}
      <div className="flex-1 flex flex-col bg-bg-secondary p-4 rounded-sm mt-8">
        <h3 className="font-black text-sm md:text-lg lg:text-3xl">
          DETAIL PEMBELI
        </h3>

        {/* if user not login */}
        {!authUser && (
          <p className="mt-4 italic flex items-center gap-2">
            <IoMdAlert /> Silahkan login terlebih dahulu untuk melakukan
            pembelian
          </p>
        )}

        {authUser && (
          <div className="flex flex-col mt-4">
            <p className="font-extrabold mb-2 lg:text-xl">Email</p>
            <div className="bg-white p-2 rounded-t-sm">
              <p className="text-sm font-bold lg:text-xl text-black">
                {authUser?.email || 'example@gmail.com'}
              </p>
            </div>
            <p className="text-[9px] p-2 lg:text-base text-black font-light bg-[#FBD300]">
              Email ini akan digunakan untuk mengirimkan faktur dan e-tiket
            </p>

            <p className="font-extrabold mb-2 lg:text-xl mt-4">Nama Lengkap</p>
            <div className="bg-white p-2 rounded-sm">
              <p className="text-sm font-bold lg:text-xl text-black">
                {authUser?.name || ''}
              </p>
            </div>

            <p className="font-extrabold mb-2 lg:text-xl mt-4">Tanggal Lahir</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded-sm">
                <p className="flex justify-between items-center text-sm font-medium lg:text-xl text-black">
                  {day}{' '}
                  <span>
                    <FaChevronDown />
                  </span>
                </p>
              </div>
              <div className="bg-white p-2 rounded-sm">
                <p className="flex justify-between items-center text-sm font-medium lg:text-xl text-black">
                  {month}{' '}
                  <span>
                    <FaChevronDown />
                  </span>
                </p>
              </div>
              <div className="bg-white p-2 rounded-sm">
                <p className="flex justify-between items-center text-sm font-medium lg:text-xl text-black">
                  {year}{' '}
                  <span>
                    <FaChevronDown />
                  </span>
                </p>
              </div>
            </div>

            <p className="font-extrabold mb-2 lg:text-xl mt-4">Jenis Kelamin</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-white p-2 rounded-sm">
                <div className="text-sm font-medium lg:text-xl text-black flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      authUser?.profile?.gender === 'Pria' ? 'bg-blue-700' : ''
                    }`}
                  ></div>
                  Laki-Laki
                </div>
              </div>
              <div className="flex-1 bg-white p-2 rounded-sm">
                <div className="text-sm font-medium lg:text-xl text-black flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      authUser?.profile?.gender === 'Wanita'
                        ? 'bg-blue-700'
                        : ''
                    }`}
                  ></div>
                  Perempuan
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* upload file  */}
      <div className="flex-1 flex justify-between items-center bg-bg-secondary p-4 rounded-sm mt-8">
        <p className="font-extrabold lg:text-xl">Bukti Transfer</p>
        <div className="flex items-center gap-2">
          <label
            htmlFor="file"
            className="font-medium lg:text-xl cursor-pointer flex items-center gap-2"
          >
            <BsPaperclip size={24} />
            Attach File
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                handlePaymentProof(file);
              }
            }}
          />
        </div>
      </div>
      <p className="text-xs px-4 mt-2 italic font-medium lg:text-xl">
        Pastikan untuk mencantumkan bukti transfer*
      </p>
    </section>
  );
}
