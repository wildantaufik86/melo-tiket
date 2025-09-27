'use client';

import { login, register } from '@/actions/auth';
import AuthForm from '@/components/fragments/form/AuthForm';
import InputContainer from '@/components/fragments/inputContainer/InputContainer';
import InputRadioContainer from '@/components/fragments/inputContainer/inputRadioContainer';
import { registerSchema } from '@/lib/validations/authValidation';
import {
  ToastError,
  ToastSuccess,
} from '@/lib/validations/toast/ToastNofication';
import { setCookie } from '@/utils/clientUtils';
import { validateInput } from '@/utils/universalUtils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Payload = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  idNumber: string;
  profile: {
    picture: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    idNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
};

export default function LoginPage() {
  const [payloadData, setPayloadData] = useState<Payload>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    idNumber: '',
    profile: {
      picture: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
      idNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    },
  });

  const regexNumber = /^\d*$/;

  const router = useRouter(); // Renamed 'route' to 'router' for consistency with Next.js docs

  console.log('payload data', payloadData);

  const handleRegister = async (e: React.FormEvent) => {
    // Type the event for better safety
    e.preventDefault();

    try {
      // 1. Client-side Validation
      const { error } = validateInput(registerSchema, payloadData);

      if (error) {
        // Directly display validation error without throwing and catching again
        ToastError(error.details[0].message);
        return; // Stop execution if validation fails
      }

      // 2. Call Server Action
      const result = await register(payloadData);

      if (result.error) {
        ToastError(result.message || 'Gagal melakukan register');
        return;
      }
      ToastSuccess(result.message || 'Berhasil register');
      router.push('/auth/login');
    } catch (error: any) {
      // Explicitly type 'error' as 'any' or more specific if known
      // Catch any unexpected errors during the process
      console.error('Register process error:', error);
      ToastError(
        error.message || 'An unexpected error occurred during register.'
      );
    }
  };

  return (
    <>
      <div className="flex h-screen w-full justify-center items-center">
        <AuthForm
          className="shadow-2xl"
          type="register"
          onSubmit={handleRegister}
        >
          <InputContainer
            type="email"
            name="email"
            value={payloadData.email}
            setValue={(value) =>
              setPayloadData((prev) => ({ ...prev, email: value }))
            }
            required={true}
          />
          <InputContainer
            type="password"
            name="password"
            value={payloadData.password}
            setValue={(value) =>
              setPayloadData((prev) => ({ ...prev, password: value }))
            }
            required={true}
          />

          <InputContainer
            type="password"
            name="Konfirmasi Password"
            value={payloadData.confirmPassword}
            setValue={(value) =>
              setPayloadData((prev) => ({ ...prev, confirmPassword: value }))
            }
            required={true}
          />
          <InputContainer
            type="text"
            name="Nomor ID"
            value={payloadData.idNumber}
            setValue={(value) => {
              if (regexNumber.test(value) && value.length <= 16) {
                setPayloadData((prev) => ({ ...prev, idNumber: value }));
              }
            }}
            required={true}
          />
          <InputContainer
            type="text"
            name="nama lengkap"
            value={payloadData.name}
            setValue={(value) =>
              setPayloadData((prev) => ({ ...prev, name: value }))
            }
            required={true}
          />
          <InputContainer
            type="text"
            name="Nomor HP"
            value={payloadData.profile.phoneNumber}
            setValue={(value) => {
              if (regexNumber.test(value)) {
                setPayloadData((prev) => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    phoneNumber: value,
                  },
                }));
              }
            }}
            required={true}
          />
          <InputRadioContainer
            name="Gender"
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            selectedValue={payloadData.profile.gender}
            setValue={(value) =>
              setPayloadData((prev) => ({
                ...prev,
                profile: { ...prev.profile, gender: value },
              }))
            }
            required
          />
          <InputContainer
            type="date"
            name="Tanggal lahir"
            value={payloadData.profile.dateOfBirth}
            setValue={(value) =>
              setPayloadData((prev) => ({
                ...prev,
                profile: {
                  ...prev.profile,
                  dateOfBirth: value,
                },
              }))
            }
            required={true}
          />
        </AuthForm>
      </div>
    </>
  );
}
