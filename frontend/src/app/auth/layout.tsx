import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Melotiket | Autentikasi',
  description: 'This is Melotiket Autentikasi',
  icons: {
    icon: '/images/melo-logo.png',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
