'use client';

import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Label from '@/components/fragments/label/Label';
import ProfileSection from '@/components/pages/user/profile/ProfileSection';
import RiwayatPembelian from '@/components/pages/user/profile/RiwayatPembelianSection';
import Image from 'next/image';
import { FaCircleInfo } from 'react-icons/fa6';
import { getMyProfile } from '@/app/api/profile';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { ITransaction } from '@/types/Transaction';

export interface IHistoryByEvent {
  _id: string;
  eventName: string;
  date: string;
  address: string;
  transactions: ITransaction[];
}

export default function ProfilePage() {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [historyEvent, setHistoryEvent] = useState<IHistoryByEvent[]>([]);
  const lastHistory = historyEvent[historyEvent.length - 1];
  const handleDownload = async () => {
    if (!ticketRef.current) return;

    // capture elemen tiket jadi canvas
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2, // biar hasil lebih tajam
    });

    const imgData = canvas.toDataURL('image/png');

    // buat dokumen PDF
    const pdf = new jsPDF('landscape', 'pt', 'a4'); // landscape biar lebih pas
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // hitung skala agar gambar muat di halaman
    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save('e-ticket.pdf');
  };

  const fetchProfil = async () => {
    try {
      const response = await getMyProfile();
      if (response.data) {
        setHistoryEvent(response.data.historyByEvent);
      }
    } catch (error: any) {
      ToastError(error.message || '');
    }
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  return (
    <div className="flex flex-col pt-24 pd-full">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <ProfileSection />
        <RiwayatPembelian
          historyTransactions={historyEvent.at(-1)?.transactions ?? []}
        />
      </div>
      <div className="flex flex-col mt-4">
        <div className="w-full md:w-1/2">
          <Label text="E TIKET" />
        </div>

        {lastHistory?.transactions.length <= 0 && (
          <div className="border border-white mt-4 p-4">
            <p className="text-xs flex items-center gap-2 md:text-sm lg:text-base">
              <FaCircleInfo />
              Kamu tidak memiliki ticket online
            </p>
          </div>
        )}

        {lastHistory?.transactions.length > 0 && (
          <div
            ref={ticketRef}
            className="flex flex-col bg-secondary p-4 mt-4 lg:p-8"
          >
            <div className="relative w-full aspect-4/2">
              <Image
                src="/images/example-ticket.jpg"
                alt="E ticket"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-8">
              <p className="text-xs font-normal md:text-sm lg:text-lg">
                E-Ticket
              </p>
              <div className="flex items-center text-xs gap-2 md:text-sm lg:text-lg">
                <button className="text-primary cursor-pointer hover:underline duration-200">
                  view
                </button>
                <span> | </span>
                <button
                  onClick={handleDownload}
                  className="cursor-pointer hover:underline duration-200"
                >
                  download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
