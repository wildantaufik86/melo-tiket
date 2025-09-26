'use client'

import { ITicket } from "@/types/Ticket";
import { PencilIcon, TrashIcon } from "@phosphor-icons/react";

interface TicketListProps {
    tickets: ITicket[];
}

export default function TicketList({ tickets }: TicketListProps) {
    return (
        <div className="p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Existing Tickets</h2>
            {tickets.length === 0 ? (
                <p>No tickets found for this event.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Category</th>
                                <th className="p-2 text-right">Price</th>
                                <th className="p-2 text-right">Stock</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket._id} className="border-b">
                                    <td className="p-2">{ticket.name}</td>
                                    <td className="p-2">{ticket.category.name}</td>
                                    <td className="p-2 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(ticket.price)}</td>
                                    <td className="p-2 text-right">{ticket.stock}</td>
                                    <td className="p-2">
                                        <div className="flex justify-center gap-2">
                                            <button className="p-2 bg-blue-500 text-white rounded"><PencilIcon size={16}/></button>
                                            <button className="p-2 bg-red-500 text-white rounded"><TrashIcon size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
