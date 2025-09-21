import MainNavbar from '@/components/navigation/MainNavbar';
import { AuthProvider } from '@/context/authUserContext';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Melotiket | Page Admin',
  description: 'This is Melotiket Admin Page',
  icons: {
    icon: '',
  },
};

export default function HomepageLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="font-mono">
      <MainNavbar />
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
