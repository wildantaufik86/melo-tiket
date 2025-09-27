'use client';

import { changePassword } from '@/actions/auth';
import AuthForm from '@/components/fragments/form/AuthForm';
import InputContainer from '@/components/fragments/inputContainer/InputContainer';
import { ToastError, ToastSuccess } from '@/lib/validations/toast/ToastNofication';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState<number | ''>('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className='flex h-screen w-full justify-center items-center'>
      <AuthForm className='shadow-2xl' type="forgot-password" onSubmit={handleForgotPassword}>
        <InputContainer
          type="email"
          name="email"
          value={email}
          setValue={setEmail}
          required={true}
        />
        <InputContainer
          type="number"
          name="idNumber"
          value={idNumber}
          setValue={(val) => setIdNumber(val === '' ? '' : Number(val))}
          required={true}
        />
        <InputContainer
          type="password"
          name="newPassword"
          value={newPassword}
          setValue={setNewPassword}
          required={true}
        />
        <InputContainer
          type="password"
          name="newPasswordConfirmation"
          value={newPasswordConfirmation}
          setValue={setNewPasswordConfirmation}
          required={true}
        />
      </AuthForm>
    </div>
  );
}
