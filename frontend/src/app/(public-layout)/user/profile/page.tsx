'use client';

import { useRef, useState, useEffect } from 'react';
import Label from '@/components/fragments/label/Label';
import ProfileSection from '@/components/pages/user/profile/ProfileSection';
import RiwayatPembelian from '@/components/pages/user/profile/RiwayatPembelianSection';
import { FaCircleInfo } from 'react-icons/fa6';
import { getMyProfile } from '@/app/api/profile';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { ITransaction } from '@/types/Transaction';
import ViewTicketModal from '@/components/fragments/modal/ViewTicketModal';
import { useAuth } from '@/context/authUserContext';
import { handleFallbackDownload } from '@/utils/universalUtils';

export interface IHistoryByEvent {
  _id: string;
  eventName: string;
  date: string;
  address: string;
  transactions: ITransaction[];
}

type TransactionSummary = Pick<ITransaction, '_id' | 'tickets'>;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [historyEvent, setHistoryEvent] = useState<IHistoryByEvent[]>([]);
  const [isViewTicket, setIsViewTicket] = useState(false);
  const { authUser } = useAuth();
  const [paidTransactions, setPaidTransactions] = useState<
    TransactionSummary[]
  >([]);
  const [ticketsUrl, setTicketsUrl] = useState<string[]>([]);

  const lastHistory = historyEvent[historyEvent.length - 1];

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

  useEffect(() => {
    if (lastHistory && lastHistory?.transactions?.length > 0) {
      const filtered = lastHistory.transactions
        .filter((data) => data.status === 'paid')
        .map((ts) => ({
          _id: ts._id,
          tickets: ts.tickets,
        }));
      setPaidTransactions(filtered);
    }
  }, [lastHistory]);

  useEffect(() => {
    if (paidTransactions.length > 0) {
      const url: string[] = paidTransactions.flatMap((data) => {
        return data.tickets.map((tc) => tc.ticketImage);
      });
      setTicketsUrl(url);
    }
  }, [paidTransactions]);

  console.log(ticketsUrl);

  return (
    <div className="flex flex-col pt-24 pd-full">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <ProfileSection />
        <RiwayatPembelian
          historyTransactions={lastHistory?.transactions ?? []}
        />
      </div>

      <section className="flex flex-col mt-4">
        <div className="w-full md:w-1/2">
          <Label text="E TIKET" />
        </div>

        {paidTransactions.length === 0 && (
          <div className="border border-white mt-4 p-4">
            <p className="text-xs flex items-center gap-2 md:text-sm lg:text-base">
              <FaCircleInfo />
              Kamu tidak memiliki ticket online
            </p>
          </div>
        )}

        <div className="flex flex-col bg-bg-secondary p-4 mt-4 lg:p-8">
          <div className="flex items-center gap-8">
            <p className="text-xs font-normal md:text-sm lg:text-lg">
              E-Ticket
            </p>
            <div className="flex items-center text-xs gap-2 md:text-sm lg:text-lg">
              <button
                onClick={() => {
                  setIsViewTicket(true);
                }}
                className="text-bg-primary cursor-pointer hover:underline duration-200"
              >
                view
              </button>
            </div>
          </div>
        </div>

        {isViewTicket && (
          <ViewTicketModal
            ref={ticketRef}
            profile={authUser}
            ticketsUrl={ticketsUrl}
            onClose={() => setIsViewTicket(false)}
            onDownload={() =>
              handleFallbackDownload(
                ticketRef,
                ticketsUrl,
                BASE_URL ? BASE_URL : ''
              )
            }
          />
        )}
      </section>
    </div>
  );
}
