import Link from "next/link";
import React from "react";

export interface BreadCrumbItem {
  label?: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadCrumbProps {
  items: BreadCrumbItem[]
}

export default function BreadCrumb({ items }: BreadCrumbProps) {
  return (
    <section id="breadcrumb">
      <div className='w-full h-10 bg-white rounded-lg shadow-sm px-4 py-2 mb-2 border border-gray-200 flex justify-start items-center'>
        <div className="flex gap-2 font-normal text-sm items-center">

          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              {item.href ? (
                <Link className="text-gray-500 hover:text-blue-600 flex items-center transition-colors" href={item.href}>
                  {item.icon && <span className="mr-1.5">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-black font-medium flex items-center">
                   {item.icon && <span className="mr-1.5">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
              {index < items.length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </React.Fragment>
          ))}

        </div>
      </div>
    </section>
  );
};
