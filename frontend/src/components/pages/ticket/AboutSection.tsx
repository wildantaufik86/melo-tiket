'use client';

import Label from '@/components/fragments/label/Label';
import { IEvent } from '@/types/Event';
import { useEffect, useState } from 'react';

type EventDetailProps = {
  eventDetail?: IEvent;
};

export default function AboutSection({ eventDetail }: EventDetailProps) {
  const [eventDesc, setEventDesc] = useState<string[]>([]);
  const [ticketDesc, setTicketDesc] = useState<string[]>([]);

  useEffect(() => {
    if (eventDetail?.eventDesc) {
      const listText = eventDetail?.eventDesc
        .split('•')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      setEventDesc(listText);
    }

    if (eventDetail?.ticketDesc) {
      const listText = eventDetail?.ticketDesc
        .split(/\d+\.\s/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      setTicketDesc(listText);
    }
  }, [eventDetail]);

  return (
    <section className="w-full flex flex-col gap-8 md:w-[60%]">
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <Label text="TENTANG MELOFEST" />
        </div>
        <div className="bg-bg-secondary rounded-md p-4 text-justify flex flex-col gap-4 text-xs font-medium lg:text-base">
          {/* even description */}
          {eventDesc.length > 0 &&
            eventDesc.map((text, index) => <p key={index}>{text}</p>)}

          {/* tampilkan description */}
          {eventDesc.length <= 0 && <p>{eventDetail?.description || ''}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <Label text="TENTANG TIKET" />
        </div>
        <div className="bg-bg-secondary rounded-md p-4 text-xs">
          <ul className="flex flex-col gap-4 font-medium lg:text-base">
            {ticketDesc.map((text, index) => (
              <li key={index}>{`${index + 1}. ${text}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
