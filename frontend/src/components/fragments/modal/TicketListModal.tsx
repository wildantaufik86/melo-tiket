'use client';

import { useTickets } from '@/hooks/useTickets';
import { formattedDate, handleFallbackDownload } from '@/utils/universalUtils';
import { useRef, useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import { useAuth } from '@/context/authUserContext';
import dynamic from 'next/dynamic';

const ViewTicketModal = dynamic(() => import('./ViewTicketModal'), {
  ssr: false,
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type TicketListModalProps = {
  closeListTicket: () => void;
};

export default function TicketListModal({
  closeListTicket,
}: TicketListModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketsUrl, setTicketsUrl] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewTicket, setIsViewTicket] = useState(false);
  const { authUser } = useAuth();
  const { paidTransactions, filteredPhaseTransaction } = useTickets();

  const handleTicketUrls = (index: number) => {
    if (paidTransactions.length > 0) {
      const url: string[] = paidTransactions[index].tickets.map((ticket) => {
        return ticket.ticketImage;
      });
      setTicketsUrl(url);
    }
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true); // hide buttons
    try {
      await handleFallbackDownload(ticketRef, ticketsUrl, BASE_URL!);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
      <div className="w-[90%] p-4 rounded-sm flex flex-col bg-white sm:max-w-[600px] sm:p-6">
        <h4 className="font-semibold text-xl">E-Ticket</h4>
        <div className="flex flex-col max-h-[200px] overflow-y-auto">
          {!filteredPhaseTransaction && (
            <div className="border border-white mt-4 p-4">
              <p className="text-xs flex items-center gap-2 md:text-sm lg:text-base">
                <FaCircleInfo />
                Kamu tidak memiliki ticket online
              </p>
            </div>
          )}

          {/* phase 1 */}
          <div className="flex flex-col mt-4">
            <p className="font-semibold text-lg">Phase 1</p>

            {filteredPhaseTransaction &&
              filteredPhaseTransaction?.phaseOne.length <= 0 && (
                <p className=" text-sm">Kamu tidak memiliki tiket</p>
              )}

            {filteredPhaseTransaction &&
              filteredPhaseTransaction?.phaseOne?.map((transaction, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-bg-secondary p-4 mt-4 lg:p-8 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                      <p className="text-xs font-normal md:text-sm lg:text-lg">
                        E-Ticket
                      </p>
                      <div className="flex items-center text-xs gap-2 md:text-sm lg:text-lg">
                        <button
                          onClick={() => {
                            handleTicketUrls(index);
                            setIsViewTicket(true);
                          }}
                          className="text-bg-primary cursor-pointer hover:underline duration-200"
                        >
                          view
                        </button>
                      </div>
                    </div>
                    <p className="text-xs">
                      {formattedDate(transaction.createdAt || '')}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* phase 2 */}
          <div className="flex flex-col mt-4">
            <p className="font-semibold text-lg">Phase 2</p>

            {filteredPhaseTransaction &&
              filteredPhaseTransaction?.phaseTwo.length <= 0 && (
                <p className=" text-sm">Kamu tidak memiliki tiket</p>
              )}
            {filteredPhaseTransaction &&
              filteredPhaseTransaction?.phaseTwo?.map((transaction, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-bg-secondary p-4 mt-4 lg:p-8 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                      <p className="text-xs font-normal md:text-sm lg:text-lg">
                        E-Ticket
                      </p>
                      <div className="flex items-center text-xs gap-2 md:text-sm lg:text-lg">
                        <button
                          onClick={() => {
                            handleTicketUrls(index);
                            setIsViewTicket(true);
                          }}
                          className="text-bg-primary cursor-pointer hover:underline duration-200"
                        >
                          view
                        </button>
                      </div>
                    </div>
                    <p className="text-xs">
                      {formattedDate(transaction.createdAt || '')}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <button
          onClick={closeListTicket}
          className="mt-4 w-32 flex justify-center items-center text-xs font-semibold py-2 px-4 rounded-sm cursor-pointer hover:opacity-80 transition-opacity bg-blue-500 text-white"
        >
          Close
        </button>
      </div>

      {/* modal view ticket */}
      {isViewTicket && (
        <ViewTicketModal
          ref={ticketRef}
          profile={authUser}
          ticketsUrl={ticketsUrl}
          onClose={() => setIsViewTicket(false)}
          onDownload={() => handleDownloadClick()}
          isDownloading={isDownloading}
        />
      )}
    </div>
  );
}
