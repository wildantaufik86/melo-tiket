// @/actions/auth.ts
'use server';

import { CONFIG } from '@/config/config';
import { cookies } from 'next/headers';

// Define the shape of your API response for login
interface LoginApiResponse {
  accessToken: string;
  user: {
    id: string; // Assuming user has an ID
    email: string;
    role: string;
    // Add any other user properties your API returns
  };
  message: string;
}

// Define the return type for your server actions for consistency
interface ServerActionResponse<T = unknown> {
  error: boolean;
  status: 'success' | 'error';
  message: string;
  data?: T | null; // Data is optional, and can be T or null
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login({ email, password }: { email: string; password: string }): Promise<ServerActionResponse<LoginApiResponse>> {
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
      // Ensure message exists or provide a default
      throw new Error(errorResponse.message || `Login failed with status: ${res.status}`);
    }

    const result: LoginApiResponse = await res.json(); // Type the response
    const { accessToken, user, message } = result;

    // Set accessToken cookie
    (await cookies()).set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true, // Crucial for security: prevents client-side JavaScript access
      sameSite: 'strict', // Protects against CSRF attacks
      secure: CONFIG.NODE_ENV === 'production', // Only send over HTTPS in production
      path: '/', // Available across the entire site
      maxAge: 60 * 60 * 24 * 7, // 7 days (Matches client-side setCookie)
    });

    // Set user cookie (also httpOnly if you want it completely server-side, but client-side needs it)
    // For the 'user' cookie, if your middleware needs to read it and it's also set by the client-side
    // setCookie utility (which it is), then it shouldn't be httpOnly from the server.
    // However, if it's only read by server-side middleware and not directly by client-side JS,
    // making it httpOnly here is more secure.
    // Given your client-side code *reads* `user.value` from the cookie, it needs to be client-readable.
    // So, we'll set `httpOnly: false` here for the 'user' cookie to allow client-side reading.
    (await cookies()).set({
      name: 'user',
      value: JSON.stringify(user), // Stringify the user object
      httpOnly: false, // Must be false if client-side JS needs to read it
      sameSite: 'strict',
      secure: CONFIG.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days (Matches client-side setCookie)
    });


    return { error: false, status: 'success', message, data: { accessToken, user, message } };
  } catch (error: any) { // Catch any type of error
    console.error('Login error:', error); // Use console.error for errors
    return {
      error: true,
      status: 'error',
      message: error.message || 'An unexpected error occurred during login',
      data: null, // No data on error
    };
  }
}

export async function register(userData: any): Promise<ServerActionResponse> { // Type userData properly based on your schema
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

    // Optionally, if register returns a message, you can include it
    const successResponse = await response.json();

    return { error: false, status: 'success', message: successResponse.message || 'Registration successful!' };
  } catch (error: any) {
    console.error('Register error:', error);
    return { error: true, status: 'error', message: error.message || 'An unexpected error occurred during registration' };
  }
}

export async function logout(): Promise<ServerActionResponse> {
  try {
    // Delete both accessToken and user cookies
    (await cookies()).delete('accessToken');
    (await cookies()).delete('user');

    return { error: false, status: 'success', message: 'Logout successful!' };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { error: true, status: 'error', message: error.message || 'An unexpected error occurred during logout' };
  }
}



export async function changePassword(data: {
  email: string;
  idNumber: number;
  currentPassword?: string;
  newPassword: string;
  newPasswordConfirmation: string;
}) {
  try {
    const res = await fetch(`${BASE_URL}/profile/forgot-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      return { error: true, message: result.message || 'Failed to update password' };
    }

    return { error: false, data: result };
  } catch (err: any) {
    return { error: true, message: err.message || 'Unexpected error occurred' };
  }
}
