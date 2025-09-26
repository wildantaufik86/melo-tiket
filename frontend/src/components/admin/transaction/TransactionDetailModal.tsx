'use client'

import { verifyTransaction } from "@/app/api/transcation";
import { ToastError, ToastSuccess } from "@/lib/validations/toast/ToastNofication";
import { ITransaction } from "@/types/Transaction";
import { useState } from "react";

interface ModalProps {
    transaction: ITransaction;
    onClose: () => void;
    onSuccessAction: () => void;
}

const isUserObject = (user: any): user is { name: string; email: string } => {
    return user && typeof user === 'object' && 'name' in user;
}

export default function TransactionDetailModal({ transaction, onClose, onSuccessAction }: ModalProps) {
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async (status: 'paid' | 'reject') => {
        setIsVerifying(true);
        const result = await verifyTransaction(transaction._id!, { status });
        if (result.status === 'success') {
            ToastSuccess(`Transaction successfully ${status}!`);
            onSuccessAction();
            onClose();
        } else {
            ToastError(`Error: ${result.message}`);
        }
        setIsVerifying(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-bold">Transaction Details</h2>
                    <button onClick={onClose} className="text-2xl font-bold">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p><strong>User:</strong> {isUserObject(transaction.userId) ? transaction.userId.name : 'N/A'}</p>
                        <p><strong>Email:</strong> {isUserObject(transaction.userId) ? transaction.userId.email : 'N/A'}</p>
                        <p><strong>cdTicket:</strong> {transaction.tickets.length}</p>
                        <p><strong>Total:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.totalPrice)}</p>
                    </div>
                    <div>
                        <p><strong>Status:</strong> <span className="font-semibold capitalize">{transaction.status}</span></p>
                        <p><strong>Method:</strong> {transaction.transactionMethod}</p>
                        <p><strong>Date:</strong> {new Date(transaction.createdAt!).toLocaleString('id-ID')}</p>
                    </div>
                </div>

                {transaction.paymentProof && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Payment Proof</h3>
                        <a href={`${transaction.paymentProof}`} target="_blank" rel="noopener noreferrer">
                            <img src={`${transaction.paymentProof}`} alt="Payment Proof" className="max-w-xs border rounded-md"/>
                        </a>
                    </div>
                )}

                {/* Aksi hanya untuk transaksi yang 'pending' */}
                {transaction.status === 'pending' && (
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            onClick={() => handleVerify('reject')}
                            disabled={isVerifying}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400">
                            {isVerifying ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                            onClick={() => handleVerify('paid')}
                            disabled={isVerifying}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400">
                            {isVerifying ? 'Processing...' : 'Approve Payment'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
