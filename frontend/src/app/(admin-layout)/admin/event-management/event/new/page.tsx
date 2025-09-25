'use client'

import EventForm from "@/components/admin/event-management/event/EventForm";
import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { TicketIcon } from "@phosphor-icons/react";

export default function NewEventPage() {
    const breadcrumbItems: BreadCrumbItem[] = [
        { label: "Dashboard", href: "/admin/homepage", icon: <TicketIcon size={16} /> },
        { label: "Event Management", href: "/admin/events" },
        { label: "Create New Event" }
    ];

    return (
        <section>
            <BreadCrumb items={breadcrumbItems} />
            <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
                <h1 className="text-xl font-extrabold text-gray-900 mb-6">Create New Event</h1>
                <EventForm />
            </div>
        </section>
    )
}
