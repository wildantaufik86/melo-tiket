'use client'

import { createUser, fetchAllUsers, fetchAllUsersForExport, ICreateUserPayload, IUpdateUserPayload, softDeleteUser, updateUserProfile } from '@/app/api/user';
import { IPaginationInfo } from '@/types/Transaction';
import { IUser } from '@/types/User';
import React, { useCallback, useEffect, useState } from 'react';
import UserList from './UserList';
import Pagination from '@/components/fragments/Pagination';
import UserFormModal from './UserFormModal';
import { ToastError, ToastSuccess } from '@/lib/validations/toast/ToastNofication';
import { searchUsers } from '@/app/api/user';
import * as XLSX from 'xlsx';
import { useAuth } from '@/context/authUserContext';

export default function AdminUserDisplay() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [pagination, setPagination] = useState<IPaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const authUser = useAuth();

    // search
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // State untuk modal form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);

    const [isExporting, setIsExporting] = useState(false);

    // Debounce effect 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadUsers = useCallback(async () => {
        setLoading(true);

        if (debouncedQuery) {
            // Search mode
            const result = await searchUsers(debouncedQuery);
            if (result.status === 'success' && result.data) {
                const extractedUsers = result.data.map(item => item.user);
                setUsers(extractedUsers);
                setPagination(null); // Search tidak pakai pagination
            } else {
                setUsers([]);
                console.error(result.message);
            }
        } else {
            // Normal mode with pagination
            const result = await fetchAllUsers(currentPage, 10);
            if (result.status === 'success' && result.data) {
                const extractedUsers = result.data.data.map(item => item.user);
                setUsers(extractedUsers);
                setPagination(result.data.pagination);
            } else {
                console.error(result.message);
            }
        }

        setLoading(false);
    }, [currentPage, debouncedQuery]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleExportToExcel = async () => {
        setIsExporting(true);
        try {
            let usersToExport: IUser[] = [];

            if (debouncedQuery) {
                // Data sudah ada dari hasil pencarian (state 'users')
                usersToExport = users;
                ToastSuccess("Mengekspor hasil pencarian...");
            } else {
                // Panggil API untuk mengambil semua data
                ToastSuccess("Mengambil semua data untuk ekspor...");
                const result = await fetchAllUsersForExport();
                if (result.status === 'success' && result.data) {
                    usersToExport = result.data;
                } else {
                    throw new Error(result.message || "Gagal mengambil semua pengguna");
                }
            }

            if (usersToExport.length === 0) {
                ToastError("Tidak ada data untuk diekspor.");
                return; // Hentikan fungsi jika tidak ada data
            }

            const formattedData = usersToExport.map(user => ({
                'ID Pengguna': user._id,
                'Nama': user.name,
                'Email': user.email,
                'No. KTP': user.idNumber,
                'No. Hp': user.profile?.phoneNumber || '',
                'Role': user.role,
                'Tanggal Bergabung': new Date(user.createdAt!).toLocaleDateString('id-ID'),
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
            XLSX.writeFile(workbook, "Data_Pengguna.xlsx");

        } catch (error: any) {
            ToastError(error.message || "Proses ekspor gagal");
        } finally {
            setIsExporting(false);
        }
    };

    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: IUser) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (formData: ICreateUserPayload | IUpdateUserPayload) => {
        let result;
        if (editingUser) {
            result = await updateUserProfile(editingUser._id!, formData as IUpdateUserPayload);
        } else {
            result = await createUser(formData as ICreateUserPayload);
        }

        if (result.status === 'success') {
            ToastSuccess(`User successfully ${editingUser ? 'updated' : 'created'}!`);
            handleCloseModal();
            loadUsers();
        } else {
            ToastError(`Error: ${result.message}`);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        const result = await softDeleteUser(userId);
        if (result.status === 'success') {
            ToastSuccess(result.message);
            loadUsers();
        } else {
            ToastError(`Error: ${result.message}`);
        }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-xl font-extrabold text-gray-900">User List</h1>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {authUser?.authUser?.role === 'superadmin' && (
                    <button
                        onClick={handleExportToExcel}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                        Export to Excel
                    </button>
                    )}
                    <button
                        onClick={handleOpenCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                        Create New User
                    </button>
                </div>
            </div>

            {loading ? (
                <p className='text-center'>Loading users...</p>
            ) : (
                <>
                    <UserList
                        users={users}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteUser}
                    />
                    {!debouncedQuery && pagination && pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}

            {isModalOpen && (
                <UserFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    editingUser={editingUser}
                />
            )}
        </div>
    );
}
