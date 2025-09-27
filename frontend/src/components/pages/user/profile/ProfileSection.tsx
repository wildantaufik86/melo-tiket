'use client';

import Label from '@/components/fragments/label/Label';
import { useAuth } from '@/context/authUserContext';
import { parseDateOfBirth } from '@/utils/universalUtils';

export default function ProfileSection() {
  const { authUser } = useAuth();
  const { day, month, year } = parseDateOfBirth(authUser?.profile?.dateOfBirth);

  return (
    <section className="flex flex-col gap-4 md:flex-1">
      <Label text="PROFILE AKUN" />
      <div className="w-full bg-secondary rounded-lg p-4 flex flex-col">
        <p className="font-extrabold mb-2 lg:text-xl">Email</p>
        <div className="bg-[#D9D9D9] p-2 rounded-t-sm">
          <p className="text-sm font-bold lg:text-xl text-black">
            {authUser?.email || 'example@gmail.com'}
          </p>
        </div>

        <p className="font-extrabold mb-2 lg:text-xl mt-4">Nama Lengkap</p>
        <div className="bg-[#D9D9D9] p-2 rounded-sm">
          <p className="text-sm font-bold lg:text-xl text-black">
            {authUser?.name || ''}
          </p>
        </div>

        <p className="font-extrabold mb-2 lg:text-xl mt-4">Tanggal Lahir</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#D9D9D9] p-2 rounded-sm">
            <p className=" text-sm font-medium lg:text-xl text-black">{day} </p>
          </div>
          <div className="bg-[#D9D9D9] p-2 rounded-sm">
            <p className=" text-sm font-medium lg:text-xl text-black">
              {month}{' '}
            </p>
          </div>
          <div className="bg-[#D9D9D9] p-2 rounded-sm">
            <p className=" text-sm font-medium lg:text-xl text-black">
              {year}{' '}
            </p>
          </div>
        </div>

        <p className="font-extrabold mb-2 lg:text-xl mt-4">Jenis Kelamin</p>
        <div className="flex gap-2">
          <div className="w-1/2 bg-[#D9D9D9] p-2 rounded-sm">
            <div className="text-sm font-medium lg:text-xl text-black flex items-center gap-2">
              {authUser?.profile?.gender || ''}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
