import AdminSidebar from "@/components/navigation/AdminSidebar";
import Image from "next/image";
import React, { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminSidebar />
        <main className="flex-1 px-5 py-3 overflow-y-auto lg:h-screen bg-gray-100">
          {children}
        </main>
        {/* <Image src="/images/bg_ornament.png" className="fixed bottom-0" width={2000} height={1000} alt="" /> */}
      </div>
    </div>
  )
};
