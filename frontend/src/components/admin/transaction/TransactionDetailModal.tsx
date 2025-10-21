'use client'

import { regenerateTransaction, revertTransaction, updatePaymentProof, updateTransactionStatus, verifyTransaction } from "@/app/api/transcation";
import { useAuth } from "@/context/authUserContext";
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
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'pending' | 'paid'>(transaction.status as 'pending' | 'paid');
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const authUser = useAuth();

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

    const handleRevert = async () => {
      setIsProcessing(true);
      const result = await revertTransaction(transaction._id!);
      if (result.status === "success") {
          ToastSuccess("Transaction successfully reverted to PAID!");
          onSuccessAction();
          onClose();
      } else {
          ToastError(`Error: ${result.message}`);
      }
      setIsProcessing(false);
    };

    const handleStatusUpdate = async () => {
      setIsUpdating(true);
      try {
          const result = await updateTransactionStatus(transaction._id!, { status: selectedStatus });
          if (result.status === 'success') {
              ToastSuccess(`Transaction status updated to ${selectedStatus}`);
              onSuccessAction();
              onClose();
          } else {
              ToastError(`Error: ${result.message}`);
          }
      } catch (err: any) {
          ToastError(`Error: ${err.message}`);
      } finally {
          setIsUpdating(false);
      }
    };

    const handleRegenerate = async () => {
      if (!transaction._id) {
        ToastError("Transaction ID tidak ditemukan");
        return;
      }

      setIsRegenerating(true);
      try {
        const res = await regenerateTransaction(transaction._id);
        if (res.status === "success") {
          ToastSuccess("Ticket berhasil di-regenerate!");
          onSuccessAction(); // refresh data list
          onClose(); // tutup modal
        } else {
          ToastError(res.message);
        }
      } catch (err: any) {
        ToastError(err.message || "Gagal meregenerasi tiket.");
      } finally {
        setIsRegenerating(false);
      }
    };

    const handleUpdatePaymentProof = async () => {
    if (!transaction?._id) {
      ToastError('Transaction ID tidak ditemukan.');
      return;
    }

    if (!uploadFile) {
      ToastError('Pilih file terlebih dahulu.');
      return;
    }
      setLoading(true);
      try {
        const res = await updatePaymentProof(transaction._id, uploadFile);
        if (res.status === 'success') {
          ToastSuccess('Payment proof berhasil diperbarui.');
          onSuccessAction();
          onClose();
        } else {
          ToastError(res.message);
        }
      } catch (err: any) {
        ToastError(err.message);
      } finally {
        setLoading(false);
      }
    };


    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-bold">Transaction Details - {transaction._id ?? ''}</h2>
                    <button onClick={onClose} className="text-2xl font-bold">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p><strong>User:</strong> {isUserObject(transaction.userId) ? transaction.userId.name : 'N/A'}</p>
                        <p><strong>Email:</strong> {isUserObject(transaction.userId) ? transaction.userId.email : 'N/A'}</p>
                        <p><strong>Ticket:</strong> {transaction.tickets.length}</p>
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
                {authUser?.authUser?.role === 'superadmin' &&
                 (transaction.status === 'reject' || transaction.status === 'expired') && (
                    <div className="flex justify-end pt-4 border-t">
                        <button
                            onClick={handleRevert}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                            {isProcessing ? 'Processing...' : 'Revert to Paid'}
                        </button>
                    </div>
                )}
                {authUser?.authUser?.role === 'superadmin' && (
                  transaction.status === 'paid') && (
                    <div className="flex flex-col justify-end md:flex-row items-center gap-4 pt-4 border-t">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as 'pending' | 'paid')}
                            className="border rounded-md px-3 py-2"
                            disabled={isUpdating}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={isUpdating || selectedStatus === transaction.status}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {isUpdating ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                )}
                {['admin', 'superadmin'].includes(authUser?.authUser?.role || '') && (
                  <div className="mt-4 border-t pt-4 flex flex-col md:flex-row items-center gap-3 justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium block mb-1">
                        Upload Payment Proof Baru
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadFile(file);
                        }}
                        className="border rounded-md p-2 text-sm w-full"
                      />
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={handleUpdatePaymentProof}
                        disabled={loading || !uploadFile}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {loading ? 'Uploading...' : 'Update Payment Proof'}
                      </button>

                      <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                      >
                        {isRegenerating ? "Regenerating..." : "Regenerate Ticket"}
                      </button>
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
}
