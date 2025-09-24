import Footer from '@/components/navigation/Footer';
import MainNavbar from '@/components/navigation/MainNavbar';
import { AuthProvider } from '@/context/authUserContext';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Melotiket | Homepage',
  description: 'This is Melotiket Homepage',
  icons: {
    icon: '/images/melo-logo.png',
  },
};

export default function HomepageLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
    <MainNavbar />
    <main className="font-mono  text-white">
      <AuthProvider>{children}</AuthProvider>
    </main>
    <Footer />
    </>
  );
}
