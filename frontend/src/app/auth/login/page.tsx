'use client';

import { login } from '@/actions/auth';
import AuthForm from '@/components/fragments/form/AuthForm';
import InputContainer from '@/components/fragments/inputContainer/InputContainer';
import { loginSchema } from '@/lib/validations/authValidation';
import {
  ToastError,
  ToastSuccess,
} from '@/lib/validations/toast/ToastNofication';
import { validateInput } from '@/utils/universalUtils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Renamed 'route' to 'router' for consistency with Next.js docs
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    // Type the event for better safety
    e.preventDefault();
    setIsLoading(true);

    // tambahkan delay sebelum proses login
    setTimeout(async () => {
      try {
        // 1. Validasi input client-side
        const { error } = validateInput(loginSchema, { email, password });
        if (error) {
          ToastError(error.details[0].message);
          return;
        }

        // 2. Panggil Server Action
        const result = await login({ email, password });

        // 3. Tangani hasil respon server
        if (result.error) {
          ToastError(
            result.message || 'Login failed. Please check your credentials.'
          );
          return;
        }

        if (!result.data || !result.data.accessToken || !result.data.user) {
          ToastError('Login failed: Invalid response from server.');
          return;
        }

        ToastSuccess('Login successful!');

        const { role } = result.data.user;
        if ( role === 'operator' || role === 'admin' || role === 'superadmin') {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
      } catch (error: any) {
        console.error('Login process error:', error);
        ToastError(
          error.message || 'An unexpected error occurred during login.'
        );
      } finally {
        setIsLoading(false);
      }
    }, 500); // ⏱️ Delay 500 ms
  };

  return (
    <>
      <div className="flex h-screen w-full justify-center items-center">
        {isLoading && (
          <div className="bg-white p-4 text-sm font-black text-black rounded-sm w-[200px]">
            loading...
          </div>
        )}
        {!isLoading && (
          <AuthForm className="shadow-2xl" type="login" onSubmit={handleLogin}>
            <InputContainer
              type="email"
              name="email"
              value={email}
              setValue={setEmail}
              required={true}
            />
            <InputContainer
              type="password"
              name="password"
              value={password}
              setValue={setPassword}
              required={true}
            />
          </AuthForm>
        )}
      </div>
    </>
  );
}
