import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { HouseIcon, TicketIcon } from "@phosphor-icons/react/dist/ssr";

export default function TicketAdminDisplay() {
    const breadcrumbItems: BreadCrumbItem[] = [
    {
      label: "Event Managements",
      href: "/admin/homepage",
      icon: <TicketIcon size={16} className='text-black/75' weight="light" />
    },
    {
      label: "Form Ticket"
    }
  ];

  return (
    <section className="">
      <BreadCrumb items={breadcrumbItems} />
      <div className='w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 flex justify-center items-center'>
        <div className="w-full max-w-2xl">
          tes
        </div>
      </div>
    </section>
  )
};
