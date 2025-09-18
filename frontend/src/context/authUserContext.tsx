'use client';

import { getCookie } from '@/utils/clientUtils'; // Assuming this is the correct path to your client-side utilities
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { logout } from '@/actions/auth'; // Assuming you want to include logout functionality
import { useRouter } from 'next/navigation'; // For redirection after logout

// Define the type for your user object stored in the cookie
interface User {
  id: string; // Assuming user has an ID
  email: string;
  name: string;
  role: string;
  // Add any other user properties you store
}

// Define the shape of the context value
interface AuthUserContextType {
  authUser: User | null;
  getUser: () => void;
  logoutUser: () => Promise<void>; // Added logout function
}

// Create the context with a default value (important for type inference)
export const AuthUserContext = createContext<AuthUserContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const router = useRouter(); // Initialize useRouter

  // Use useCallback to memoize getUser to prevent unnecessary re-renders
  const getUser = useCallback(() => {
    // getCookie already returns the parsed object, or null
    const user = getCookie<User>('user'); // <--- Specify the expected type for getCookie

    if (user) {
      // No need for JSON.parse here, as getCookie already did it
      setAuthUser(user);
    } else {
      setAuthUser(null);
    }
  }, []); // Empty dependency array means this function is created once

  const logoutUser = useCallback(async () => {
    try {
      const result = await logout(); // Call the server action to clear cookies
      if (!result.error) {
        setAuthUser(null); // Clear client-side state
        router.push('/auth/login'); // Redirect to login page after logout
      } else {
        console.error('Logout failed:', result.message);
      }
    } catch (error) {
      console.error('Error during logout process:', error);
    }
  }, [router]);


  useEffect(() => {
    getUser();
  }, [getUser]); // Add getUser to dependencies since it's a function from the outer scope

  return (
    <AuthUserContext.Provider value={{ authUser, getUser, logoutUser }}> {/* Include logoutUser in value */}
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
