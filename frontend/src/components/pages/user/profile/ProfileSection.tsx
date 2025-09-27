'use client';

import { getMyProfile, updateMyProfile } from '@/app/api/profile';
import { IUpdateUserPayload } from '@/app/api/user';
import InputContainer from '@/components/fragments/inputContainer/InputContainer';
import Label from '@/components/fragments/label/Label';
import { useAuth } from '@/context/authUserContext';
import {
  ToastError,
  ToastSuccess,
} from '@/lib/validations/toast/ToastNofication';
import { parseDateOfBirth } from '@/utils/universalUtils';
import { useState } from 'react';

export default function ProfileSection() {
  const { authUser } = useAuth();
  const { day, month, year } = parseDateOfBirth(authUser?.profile?.dateOfBirth);
  const [payloadIdNumber, setPayloadIdNumber] = useState<string>('');
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const regexNumber = /^\d*$/;

  const handleEdit = async () => {
    try {
      const response = await updateMyProfile(Number(payloadIdNumber));
      if (response.data) {
        ToastSuccess(response.message || 'Berhasil update');
      } else {
        ToastError(response.message || 'Gagal update data');
      }
    } catch (error: any) {
      ToastError(error.message || '');
    } finally {
      setOpenModalEdit(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 md:flex-1">
      <Label text="PROFILE AKUN" />
      <div className="w-full bg-secondary rounded-lg p-4 flex flex-col">
        <p className="font-extrabold mb-2 lg:text-sm">NIK</p>
        <div className="bg-white p-2 rounded-t-sm">
          <p className="text-sm font-bold lg:text-base text-black">
            {authUser?.idNumber || ''}
          </p>
        </div>

        <p className="font-extrabold mb-2 lg:text-sm">Email</p>
        <div className="bg-white p-2 rounded-t-sm">
          <p className="text-sm font-bold lg:text-base text-black">
            {authUser?.email || 'example@gmail.com'}
          </p>
        </div>

        <p className="font-extrabold mb-2 lg:text-base mt-4">Nama Lengkap</p>
        <div className="bg-white p-2 rounded-sm">
          <p className="text-sm font-bold lg:text-base text-black">
            {authUser?.name || ''}
          </p>
        </div>

        <p className="font-extrabold mb-2 lg:text-base mt-4">Tanggal Lahir</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-2 rounded-sm">
            <p className=" text-sm font-medium lg:text-base text-black">
              {day}{' '}
            </p>
          </div>
          <div className="bg-white p-2 rounded-sm">
            <p className=" text-sm font-medium lg:text-base text-black">
              {month}{' '}
            </p>
          </div>
          <div className="bg-white p-2 rounded-sm">
            <p className=" text-sm font-medium lg:text-base text-black">
              {year}{' '}
            </p>
          </div>
        </div>

        <p className="font-extrabold mb-2 lg:text-base mt-4">Jenis Kelamin</p>
        <div className="flex gap-2">
          <div className="w-1/2 bg-white p-2 rounded-sm">
            <div className="text-sm font-medium lg:text-base text-black flex items-center gap-2">
              {authUser?.profile?.gender || ''}
            </div>
          </div>
        </div>

        <div onClick={() => setOpenModalEdit(true)} className="mt-8">
          <div className="py-2 px-4 text-xs flex justify-center items-center bg-slate-300 text-black font-semibold rounded-sm cursor-pointer md:text-sm hover:bg-slate-400 transition-colors">
            Edit Profile
          </div>
        </div>
      </div>

      {openModalEdit && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
          <div className="w-[70%] max-w-[600px] bg-white rounded-sm flex text-black flex-col p-4">
            <div className="flex flex-col gap-4">
              <InputContainer
                type="text"
                name="Nomor ID"
                value={payloadIdNumber}
                setValue={(value) => {
                  if (regexNumber.test(value) && value.length <= 16) {
                    setPayloadIdNumber(value);
                  }
                }}
                required={true}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpenModalEdit(false)}
                type="button"
                className="bg-primary hover:bg-hover transition-colors text-white font-semibold text-xs rounded-sm py-2 px-4 mt-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                type="button"
                className="bg-secondary text-white font-semibold text-xs rounded-sm py-2 px-4 mt-4 cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
