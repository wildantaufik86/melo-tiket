'use client';

import { changePassword } from '@/actions/auth';
import AuthForm from '@/components/fragments/form/AuthForm';
import InputContainer from '@/components/fragments/inputContainer/InputContainer';
import {
  ToastError,
  ToastSuccess,
} from '@/lib/validations/toast/ToastNofication';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState<string | ''>('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const regexNumber = /^\d*$/;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setTimeout(async () => {
      try {
        // Minimal validation
        if (!email || !idNumber || !newPassword || !newPasswordConfirmation) {
          ToastError('All fields are required');
          return;
        }

        if (!email) {
          ToastError('Email is required');
          return;
        }

        if (!newPassword || !newPasswordConfirmation) {
          ToastError('Password fields are required');
          return;
        }

        const result = await changePassword({
          email,
          idNumber: Number(idNumber),
          newPassword,
          newPasswordConfirmation,
        });

        if (result.error) {
          ToastError(result.message);
          return;
        }
        ToastSuccess('Password changed successfully! Now you can login.');

        setEmail('');
        setIdNumber('');
        setNewPassword('');
        setNewPasswordConfirmation('');
      } catch (err: any) {
        console.error('Forgot password error:', err);
        ToastError(err.message || 'Unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex h-screen w-full justify-center items-center">
      {isLoading && (
        <div className="bg-white p-4 text-sm font-black text-black rounded-sm w-[200px]">
          loading...
        </div>
      )}
      {!isLoading && (
        <AuthForm
          className="shadow-2xl"
          type="forgot-password"
          onSubmit={handleForgotPassword}
        >
          <InputContainer
            type="email"
            name="email"
            value={email}
            setValue={setEmail}
            required={true}
          />
          <InputContainer
            type="text"
            name="NIK"
            value={idNumber}
            setValue={(value) => {
              if (regexNumber.test(value) && value.length <= 16) {
                setIdNumber(value);
              }
            }}
            required={true}
          />
          <InputContainer
            type="password"
            name="New Password"
            value={newPassword}
            setValue={setNewPassword}
            required={true}
          />
          <InputContainer
            type="password"
            name="New Password Confirmation"
            value={newPasswordConfirmation}
            setValue={setNewPasswordConfirmation}
            required={true}
          />
        </AuthForm>
      )}
    </div>
  );
}
