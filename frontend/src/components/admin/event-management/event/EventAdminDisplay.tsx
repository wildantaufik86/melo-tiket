'use client'

import { createCategory, fetchAllCategories, softDeleteCategory, updateCategory } from "@/app/api/categories";
import InputContainer from "@/components/fragments/inputContainer/InputContainer";
import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { ICategory } from "@/types/Category";
import { HouseIcon, PencilIcon, PlusIcon, TicketIcon, TrashIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminEventDisplay() {


  const breadcrumbItems: BreadCrumbItem[] = [
    {
      label: "Event Managements",
      href: "/admin/homepage",
      icon: <TicketIcon size={16} className='text-black/75' weight="light" />
    },
    {
      label: "Form Event"
    }
  ];

  return (
    <section className="">
      <BreadCrumb items={breadcrumbItems} />
      <div className='w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 flex justify-center items-center'>
        <div className="w-full max-w-2xl"></div>
      </div>
    </section>
  )
};
