'use client'

import { ITicket, TicketStatus } from "@/types/Ticket";
import { PencilIcon, TrashIcon } from "@phosphor-icons/react";

interface TicketListProps {
    tickets: ITicket[];
    onEdit: (ticket: ITicket) => void;      // DITAMBAHKAN
    onDelete: (ticketId: string) => void; // DITAMBAHKAN
}

export default function TicketList({ tickets, onEdit, onDelete }: TicketListProps) { // DITAMBAHKAN props
    return (
        <div className="p-6 rounded-lg border border-gray-200 shadow-2xl">
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
                                <th className="p-2 text-center">Status</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket._id} className="border-b border-gray-200 duration-500 hover:bg-gray-50">
                                    <td className="p-2">{ticket.name}</td>
                                    <td className="p-2">{ticket.category.name}</td>
                                    <td className="p-2 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(ticket.price)}</td>
                                    <td className="p-2 text-right">{ticket.stock}</td>
                                    <td className="p-2 text-center">
                                      <span className={`px-2 py-1 text-xs rounded-full
                                        ${ticket.status === TicketStatus.AVAILABLE ? 'bg-green-200 text-green-800' :
                                          ticket.status === TicketStatus.UNAVAILABLE ? 'bg-yellow-200 text-yellow-800' :
                                          'bg-red-200 text-red-800'}
                                      `}>
                                        {ticket.status}
                                      </span>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex justify-center gap-2">
                                            {/* DIUBAH: Tambahkan onClick untuk memanggil props */}
                                            <button onClick={() => onEdit(ticket)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"><PencilIcon size={16}/></button>
                                            <button onClick={() => onDelete(ticket._id!)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><TrashIcon size={16}/></button>
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
