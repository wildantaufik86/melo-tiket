import Footer from '@/components/navigation/Footer';
import MainNavbar from '@/components/navigation/MainNavbar';
import { AuthProvider } from '@/context/authUserContext';
import { OrderProvider } from '@/context/ordersContext';
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
});

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
      <main className={`${montserrat.className} text-white`}>
        <AuthProvider>
          <OrderProvider>{children}</OrderProvider>
        </AuthProvider>
      </main>
      <Footer />
    </>
  );
}
