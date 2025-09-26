'use client'

import { fetchAllEvents } from "@/app/api/event";
import { fetchAllTicket } from "@/app/api/ticket";
import { createTransaction, ICreateTransactionPayload } from "@/app/api/transcation";
import { searchUsers } from "@/app/api/user";
import { IEvent } from "@/types/Event";
import { ITicket } from "@/types/Ticket";
import { IUser } from "@/types/User";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";


export default function CreateTransactionForm() {
    const router = useRouter();
    const [users, setUsers] = useState<IUser[]>([]);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [availableTickets, setAvailableTickets] = useState<ITicket[]>([]);

    const [userSearch, setUserSearch] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [cart, setCart] = useState<Record<string, number>>({});
    const [transactionMethod, setTransactionMethod] = useState<'Online' | 'Onsite'>('Onsite');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    const [loading, setLoading] = useState({ users: false, events: false, tickets: false });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const [debouncedUserSearch] = useDebounce(userSearch, 500);

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(prev => ({ ...prev, events: true }));
            const result = await fetchAllEvents();
            if (result.status === 'success') setEvents(result.data || []);
            setLoading(prev => ({ ...prev, events: false }));
        };
        loadEvents();
    }, []);

    useEffect(() => {
        if (debouncedUserSearch.length > 2) {
            const loadUsers = async () => {
                setLoading(prev => ({ ...prev, users: true }));
                const result = await searchUsers(debouncedUserSearch);
                if (result.status === 'success') setUsers(result.data || []);
                setLoading(prev => ({ ...prev, users: false }));
            };
            loadUsers();
        } else {
            setUsers([]);
        }
    }, [debouncedUserSearch]);

    useEffect(() => {
        if (selectedEventId) {
            const loadTickets = async () => {
                setLoading(prev => ({ ...prev, tickets: true }));
                const result = await fetchAllTicket(selectedEventId);
                if (result.status === 'success') setAvailableTickets(result.data || []);
                setCart({});
                setLoading(prev => ({ ...prev, tickets: false }));
            };
            loadTickets();
        } else {
            setAvailableTickets([]);
        }
    }, [selectedEventId]);

    const handleQuantityChange = (ticketId: string, quantity: number) => {
        setCart(prev => ({ ...prev, [ticketId]: Math.max(0, quantity) }));
    };

    const totalPrice = useMemo(() => {
        return availableTickets.reduce((total, ticket) => {
            const quantity = cart[ticket._id!] || 0;
            return total + (ticket.price * quantity);
        }, 0);
    }, [cart, availableTickets]);

    const handleSubmit = async () => {
        if (!selectedUserId) {
            setMessage('Error: Please select a user.');
            return;
        }
        const ticketsInCart = Object.entries(cart).filter(([, quantity]) => quantity > 0);
        if (ticketsInCart.length === 0) {
            setMessage('Error: Please add at least one ticket to the cart.');
            return;
        }

        setSubmitting(true);
        setMessage('');

        const payload: ICreateTransactionPayload = {
            userId: selectedUserId,
            transactionMethod,
            paymentProof,
            tickets: ticketsInCart.map(([ticketId, quantity]) => ({ ticketId, quantity })),
        };

        const result = await createTransaction(payload);
        if (result.status === 'success') {
            setMessage('Transaction created successfully! Redirecting...');
            setTimeout(() => router.push('/admin/transactions'), 2000);
        } else {
            setMessage(`Error: ${result.message}`);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            {message && <p className={`p-3 rounded-md text-center ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</p>}

            {/* Step 1: User Selection */}
            <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">1. Select User</h3>
                <input
                    type="text"
                    placeholder="Search user by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
                {loading.users && <p className="text-xs mt-1">Searching users...</p>}
                {users.length > 0 && (
                    <select onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId} className="w-full p-2 border rounded-md mt-2">
                        <option value="">-- Select a User --</option>
                        {users.map(user => <option key={user._id} value={user._id!}>{user.name} ({user.email})</option>)}
                    </select>
                )}
            </div>

            {/* Step 2: Event & Ticket Selection */}
            {selectedUserId && (
                <div className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-2">2. Select Event & Tickets</h3>
                    <select onChange={(e) => setSelectedEventId(e.target.value)} value={selectedEventId} className="w-full p-2 border rounded-md mb-4">
                        <option value="">-- Select an Event --</option>
                        {events.map(event => <option key={event._id} value={event._id!}>{event.eventName}</option>)}
                    </select>

                    {loading.tickets && <p>Loading tickets...</p>}
                    {availableTickets.length > 0 && (
                        <div className="space-y-2">
                            {availableTickets.map(ticket => (
                                <div key={ticket._id} className="grid grid-cols-4 items-center gap-2 text-sm">
                                    <span>{ticket.name} ({ticket.category.name})</span>
                                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(ticket.price)}</span>
                                    <span>Stock: {ticket.stock}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max={ticket.stock}
                                        value={cart[ticket._id!] || 0}
                                        onChange={(e) => handleQuantityChange(ticket._id!, parseInt(e.target.value))}
                                        className="p-1 border rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Finalize Transaction */}
            {totalPrice > 0 && (
                <div className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-2">3. Finalize Purchase</h3>
                    <div className="space-y-4">
                        {/* DIUBAH: value untuk 'On The Site' */}
                        <select value={transactionMethod} onChange={(e) => setTransactionMethod(e.target.value as any)} className="w-full p-2 border rounded-md">
                            <option value="Onsite">Onsite (Cash)</option>
                            <option value="Online">Online (Transfer)</option>
                        </select>
                        <input type="file" onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)} className="w-full text-sm"/>
                        <div className="text-right">
                            <p className="text-lg font-bold">Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}</p>
                            <button onClick={handleSubmit} disabled={submitting} className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                                {submitting ? 'Processing...' : 'Create Transaction'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
