'use client';

import { login } from '@/actions/auth';
import AuthForm from '@/components/fragments/form/AuthForm';
import InputContainer from '@/components/fragments/inputContainer/InputContainer';
import MainNavbar from '@/components/navigation/MainNavbar';
import { loginSchema } from '@/lib/validations/authValidation';
import {
  ToastError,
  ToastSuccess,
} from '@/lib/validations/toast/ToastNofication';
import { setCookie } from '@/utils/clientUtils';
import { validateInput } from '@/utils/universalUtils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Renamed 'route' to 'router' for consistency with Next.js docs

  const handleLogin = async (e: React.FormEvent) => {
    // Type the event for better safety
    e.preventDefault();

    try {
      // 1. Client-side Validation
      const { error } = validateInput(loginSchema, {
        email,
        password,
      });

      if (error) {
        // Directly display validation error without throwing and catching again
        ToastError(error.details[0].message);
        return; // Stop execution if validation fails
      }

      // 2. Call Server Action
      const result = await login({ email, password });

      // 3. Handle Server Action Response
      if (result.error) {
        ToastError(
          result.message || 'Login failed. Please check your credentials.'
        );
        return; // Stop execution if server action reported an error
      }

      // Ensure result.data and its properties exist
      if (!result.data || !result.data.accessToken || !result.data.user) {
        ToastError('Login failed: Invalid response from server.');
        return;
      }

      // 4. Set Cookies
      // Assuming result.data.accessToken and result.data.user are available
      // It's crucial to set the accessToken cookie as your middleware relies on it.
      // Add `httpOnly: true` and `secure: true` if you're setting cookies from the server-side,
      // but for client-side `setCookie`, you might not have these options directly unless your `setCookie` utility handles them.
      // For proper security, ideally, `accessToken` should be HttpOnly and set by the server.
      // If `setCookie` is a client-side utility, ensure it's not exposing sensitive data.
      // setCookie('accessToken', result.data.accessToken); // e.g., 7 days
      // setCookie('user', result.data.user); // Store user object as a string

      ToastSuccess('Login successful!');

      // 5. Redirect based on role
      if (result.data.user.role === 'admin' || 'superadmin') {
        router.replace('/admin');
      } else {
        // Redirect non-admin users to a default page, e.g., home or a user dashboard
        router.replace('/');
      }
    } catch (error: any) {
      // Explicitly type 'error' as 'any' or more specific if known
      // Catch any unexpected errors during the process
      console.error('Login process error:', error);
      ToastError(error.message || 'An unexpected error occurred during login.');
    }
  };

  return (
    <>
      <div className="flex h-screen w-full justify-center items-center">
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
      </div>
    </>
  );
}
