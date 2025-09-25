import AdminSidebar from "@/components/navigation/AdminSidebar";
import { AuthProvider } from "@/context/authUserContext";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Melotiket | Page Admin",
  description: "This is Melotiket Admin Page",
  icons: {
    icon: '/images/melo-logo.png',
  },
};

export default function AdminLayout({children}: Readonly<{children: ReactNode}>) {

 return (
  <React.Fragment>
    <AuthProvider>
    {children}
    </AuthProvider>
  </React.Fragment>
 )
};
