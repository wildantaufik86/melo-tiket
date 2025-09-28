'use server';

import { CONFIG } from '@/config/config';
import { cookies } from 'next/headers';

interface LoginApiResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    profile?: {
      address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        village: string;
        subDistrict: string;
      };
      picture: string;
      phoneNumber: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message: string;
}

interface ServerActionResponse<T = unknown> {
  error: boolean;
  status: 'success' | 'error';
  message: string;
  data?: T | null;
}

interface LoginProps {
  email: string;
  password: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login({ email, password }: LoginProps): Promise<ServerActionResponse<{ user: LoginApiResponse['user'] }>> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.message || `Login failed with status: ${res.status}`);
    }

    const result: LoginApiResponse = await res.json();
    const { accessToken, user, message } = result;

    (await cookies()).set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      sameSite: 'strict',
      secure: CONFIG.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    (await cookies()).set({
      name: 'user',
      value: JSON.stringify(user),
      httpOnly: false,
      sameSite: 'strict',
      secure: CONFIG.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { error: false, status: 'success', message, data: { user } };
  } catch (error) {
    const err = error as Error;
    console.error('Login error:', err);
    return {
      error: true,
      status: 'error',
      message: err.message || 'An unexpected error occurred during login',
      data: null,
    };
  }
}

export async function register({ userData }: { userData: any }): Promise<ServerActionResponse> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || `Registration failed with status: ${response.status}`);
    }

    const successResponse = await response.json();

    return { error: false, status: 'success', message: successResponse.message || 'Registration successful!' };
  } catch (error) {
    const err = error as Error;
    console.error('Register error:', err);
    return {
      error: true,
      status: 'error',
      message: err.message || 'An unexpected error occurred during registration',
    };
  }
}

export async function logout(): Promise<ServerActionResponse> {
  try {
    (await cookies()).delete('accessToken');
    (await cookies()).delete('user');

    return { error: false, status: 'success', message: 'Logout successful!' };
  } catch (error) {
    const err = error as Error;
    console.error('Logout error:', err);
    return {
      error: true,
      status: 'error',
      message: err.message || 'An unexpected error occurred during logout',
    };
  }
}
