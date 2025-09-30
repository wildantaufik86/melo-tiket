'use client';

import { IUser } from '@/types/User';
import Image from 'next/image';
import { forwardRef } from 'react';

type TicketDataProps = {
  profile?: IUser | null;
  ticketsUrl: string[];
  onClose: () => void;
  onDownload: () => void;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// forwardRef supaya parent bisa akses ref ke bg-white div
const ViewTicketModal = forwardRef<HTMLDivElement, TicketDataProps>(
  ({ profile, ticketsUrl, onClose, onDownload }, ref) => {
    return (
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} // ✅ Inline style
      >
        <div
          ref={ref}
          className="w-[90%] p-4 rounded-sm flex flex-col sm:max-w-[600px] sm:p-6"
          style={{
            backgroundColor: '#ffffff', // Gunakan warna hex langsung
            color: '#000000',
          }}
        >
          <div className="flex flex-col gap-4" style={{ color: '#000000' }}>
            <h4 className="font-black text-lg">Informasi Pembeli</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm lg:text-sm">NIK</p>
                <div
                  className="p-2 rounded-sm"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <p
                    className="text-xs lg:text-base"
                    style={{ color: '#000000' }}
                  >
                    {profile?.idNumber || ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm lg:text-sm">Nama Lengkap</p>
                <div
                  className="p-2 rounded-sm"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <p
                    className="text-xs lg:text-base"
                    style={{ color: '#000000' }}
                  >
                    {profile?.name || ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm lg:text-sm">Nomor HP</p>
                <div
                  className="p-2 rounded-sm"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <p
                    className="text-xs lg:text-base"
                    style={{ color: '#000000' }}
                  >
                    {profile?.profile?.phoneNumber || ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm lg:text-sm">Email</p>
                <div
                  className="p-2 rounded-sm"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <p
                    className="text-xs lg:text-base"
                    style={{ color: '#000000' }}
                  >
                    {profile?.email || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <h4 className="font-black text-lg" style={{ color: '#000000' }}>
              E-Ticket
            </h4>
            <div className="flex flex-col gap-4 max-h-[200px] overflow-y-auto">
              {ticketsUrl.length > 0 &&
                ticketsUrl.map((data, index) => (
                  <div key={index} className="relative w-full">
                    <img
                      src={BASE_URL + data}
                      alt="E ticket"
                      className="object-contain w-[500px] h-[200px]"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onDownload}
              className="mt-2 w-32 flex justify-center items-center text-xs font-semibold py-2 px-4 rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#1f2937', color: '#ffffff' }}
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="mt-2 w-32 flex justify-center items-center text-xs font-semibold py-2 px-4 rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ViewTicketModal.displayName = 'ViewTicketModal';
export default ViewTicketModal;
