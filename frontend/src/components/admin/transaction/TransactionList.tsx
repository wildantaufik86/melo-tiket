'use client'

import { ITransaction } from "@/types/Transaction";
import { EyeIcon } from "@phosphor-icons/react";

interface TransactionListProps {
    transactions: ITransaction[];
    onViewDetails: (transaction: ITransaction) => void;
}

const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleString('id-ID') : 'N/A';

const getStatusBadge = (status: ITransaction['status']) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        reject: 'bg-red-100 text-red-800',
        expired: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || styles.expired;
};

const isUserObject = (user: any): user is { name: string; email: string } => {
    return user && typeof user === 'object' && 'name' in user;
}

export default function TransactionList({ transactions, onViewDetails }: TransactionListProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-700 uppercase">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Total Price</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600">
                    {transactions.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4">No transactions found.</td></tr>
                    )}
                    {transactions.map(trx => (
                        <tr key={trx._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{isUserObject(trx.userId) ? trx.userId.name : 'N/A'}</td>
                            <td className="py-3 px-4">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(trx.totalPrice)}</td>
                            <td className="py-3 px-4">{formatDate(trx.createdAt)}</td>
                            <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(trx.status)}`}>
                                    {trx.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <button onClick={() => onViewDetails(trx)} className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                                    <EyeIcon size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
