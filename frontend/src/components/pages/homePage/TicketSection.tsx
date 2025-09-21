import Image from 'next/image';
import Link from 'next/link';

export default function TicketSection() {
  return (
    <div className="relative flex flex-col items-center py-[28%]">
      {/* Judul */}
      <h2 className="z-10 text-xl font-semibold text-center w-[50%]  md:text-3xl lg:text-5xl">
        Melophile Festival Vol 2
      </h2>

      {/* Label */}
      <div className="z-10 bg-[url(/images/label.png)] bg-center bg-contain bg-no-repeat py-2 px-6 mt-4">
        <span className="text-xs flex justify-center items-center md:text-lg lg:text-xl">
          GET YOUR TICKET NOW
        </span>
      </div>

      <div className="absolute inset-0 top-15 mt-16">
        <div className="flex justify-center items-center pb-12 bg-[url(/images/awan.png)] bg-cover bg-no-repeat bg-center aspect-square">
          {/* Grid tiket */}
          <div className="grid grid-cols-4 justify-items-center mt-4 w-full max-w-5xl">
            <Link
              href="/ticket/vip"
              className="relative w-full max-w-[600px] aspect-square"
            >
              <Image
                src="/images/VIP.png"
                alt="VIP Ticket"
                fill
                className="object-contain"
              />
            </Link>

            <Link
              href="/ticket/festival-a"
              className="relative w-full max-w-[600px] aspect-square"
            >
              <Image
                src="/images/fest-a.png"
                alt="Festival A Ticket"
                fill
                className="object-contain"
              />
            </Link>

            <Link
              href="/ticket/festival-b"
              className="relative w-full max-w-[600px] aspect-square"
            >
              <Image
                src="/images/fest-b.png"
                alt="Festival B Ticket"
                fill
                className="object-contain"
              />
            </Link>

            <Link
              href="/ticket/tribun"
              className="relative w-full max-w-[600px] aspect-square"
            >
              <Image
                src="/images/TRIBUN.png"
                alt="Tribun Ticket"
                fill
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
