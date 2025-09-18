import { AuthProvider } from "@/context/authUserContext";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Melotiket | Page Admin",
  description: "This is Melotiket Admin Page",
  icons: {
    icon: '',
  },
};

export default function AdminLayout({children}: Readonly<{children: ReactNode}>) {

 return (
  <div>
    <AuthProvider>
    {children}
    </AuthProvider>
  </div>
 )
};
