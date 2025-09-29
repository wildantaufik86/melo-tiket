'use client';

import React, { useCallback, useEffect, useState } from 'react';
import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { ITransaction, IPaginationInfo } from '@/types/Transaction';
import { fetchAllTransactions } from '@/app/api/transcation';
import TransactionFilter from './TransactionFilter';
import TransactionList from './TransactionList';
import Pagination from '@/components/fragments/Pagination';
import TransactionDetailModal from './TransactionDetailModal';
import { HouseIcon } from '@phosphor-icons/react/dist/ssr';
import { useDebounce } from 'use-debounce';

type StatusFilter = 'pending' | 'paid' | 'reject' | 'expired' | 'all';

export default function AdminTransactionDisplay() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [pagination, setPagination] = useState<IPaginationInfo | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);

    const breadcrumbItems: BreadCrumbItem[] = [
        { label: "Dashboard", href: "/admin/homepage", icon: <HouseIcon size={16} /> },
        { label: "Transaction Management" }
    ];

    const [debouncedSearch] = useDebounce(searchTerm, 2000);

    const loadTransactions = useCallback(async () => {
        setLoading(true);
        const statusToSend = statusFilter === 'all' ? undefined : statusFilter;
        const result = await fetchAllTransactions(currentPage, 10, statusToSend, debouncedSearch);

        if (result.status === 'success' && result.data) {
            setTransactions(result.data.data || []);
            setPagination(result.data.pagination || null);
        } else {
            console.error(result.message);
            // Anda bisa menambahkan notifikasi error di sini
        }
        setLoading(false);
    }, [currentPage, statusFilter, debouncedSearch]);

    // useEffect untuk memuat data saat filter atau halaman berubah
    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const handleFilterChange = (newStatus: StatusFilter) => {
        setCurrentPage(1); // Selalu reset ke halaman 1 saat filter diubah
        setStatusFilter(newStatus);
    };

    return (
        <section>
            <BreadCrumb items={breadcrumbItems} />
            <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
<div className="flex justify-between items-center mb-6 gap-4">
  <h1 className="text-xl font-extrabold text-gray-900">Transaction Management</h1>
  <div className="flex items-center gap-3">
    <input
      type="text"
      placeholder="Search by user or transaction ID..."
      value={searchTerm}
      onChange={(e) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
      }}
      className="border rounded-lg px-3 py-2 text-sm"
    />
    <TransactionFilter currentFilter={statusFilter} onFilterChange={handleFilterChange} />
  </div>
</div>

                {loading ? (
                    <p className='text-center'>Loading transactions...</p>
                ) : (
                    <>
                        <TransactionList
                            transactions={transactions}
                            onViewDetails={setSelectedTransaction}
                        />
                        {pagination && pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>

            {selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    onSuccessAction={loadTransactions} // Kirim fungsi untuk me-refresh data
                />
            )}
        </section>
    );
}
