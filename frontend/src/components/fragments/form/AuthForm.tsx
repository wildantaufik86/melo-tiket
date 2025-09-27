import Link from 'next/link';
import React from 'react';

interface AuthFormProps {
  type: 'login' | 'register' | 'forgot-password';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  error?: string;
  className?: string;
  isSuccess?: boolean;
}

export default function AuthForm({
  type,
  onSubmit,
  children,
  error = '',
  className,
  isSuccess = false,
}: AuthFormProps) {

  const textOptions = {
    'login': 'Sign In',
    'register': 'Sign Up',
    'forgot-password': 'Forgot Password'
  }

  return (
    <div className={`bg-white flex flex-col w-[80%] py-8 overflow-y-auto md:max-h-[500px] md:mt-8 max-h-[400px] rounded-md items-center max-w-[400px] ${className}`}>
      <h3 className="text-3xl font-bold">
        {textOptions[type]}
      </h3>

      {error && (
        <p className="text-xs text-red-500 text-center mt-4">{error}</p>
      )}

      {isSuccess && !error && (
        <p className="text-xs text-green-500 text-center mt-4">
          Success register, please login
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col px-8 mt-4 gap-4"
      >
        {/* input form */}
        {children}

        <div className="mt-1">
          {type === 'login' ? (
            <p className="text-xs">
              Forgot Password{' '}
              <Link
                href="/auth/forgot-password"
                className="font-bold cursor-pointer hover:underline hover:decoration-solid"
              >
                {' '}
                Click Here
              </Link>
            </p>
          ) : (<></>)}
        </div>

        {isSuccess && !error && (
          <p className="text-xs text-green-500 text-center mt-4">
            Success register, please login
          </p>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="bg-black text-white font-semibold text-xs py-2 rounded-md cursor-pointer hover:bg-black/75 transition-colors"
          >
            {type === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        <div className="mt-1">
          {type === 'login' ? (
            <p className="text-xs">
              Not yet have an account?{' '}
              <Link
                href="/auth/register"
                className="font-bold cursor-pointer hover:underline hover:decoration-solid"
              >
                {' '}
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-xs">
              Already have an account?
              <Link
                href="/auth/login"
                className="font-bold cursor-pointer hover:underline hover:decoration-solid"
              >
                {' '}
                Sign In
              </Link>
            </p>
          )}
        </div>

      </form>
    </div>
  );
}
