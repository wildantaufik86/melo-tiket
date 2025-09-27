import Label from '@/components/fragments/label/Label';
import ProfileSection from '@/components/pages/user/profile/ProfileSection';
import RiwayatPembelian from '@/components/pages/user/profile/RiwayatPembelianSection';
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <div className="flex flex-col pt-24 pd-full">
      <div className="flex flex-col gap-4 md:flex-row">
        <ProfileSection />
        <RiwayatPembelian />
      </div>
      <div className="flex flex-col mt-4">
        <div className="w-full md:w-1/2">
          <Label text="E TIKET" />
        </div>
        <div className="flex flex-col bg-secondary p-4 mt-4 lg:p-8">
          <div className="relative w-full aspect-4/2 ">
            <Image
              src="/images/example-ticket.jpg"
              alt="E ticket"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-8 ">
            <p className="text-xs font-normal md:text-sm lg:text-lg">
              E-Ticket
            </p>
            <div className="flex items-center text-xs gap-2 md:text-sm lg:text-lg">
              <button className="text-primary cursor-pointer hover:underline duration-200">
                view
              </button>
              <span> | </span>
              <button className="cursor-pointer hover:underline duration-200">
                download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
