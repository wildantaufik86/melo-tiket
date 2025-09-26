'use client'

import { createUser, fetchAllUsers, ICreateUserPayload, IUpdateUserPayload, softDeleteUser, updateUserProfile } from '@/app/api/user';
import { IPaginationInfo } from '@/types/Transaction';
import { IUser } from '@/types/User';
import React, { useCallback, useEffect, useState } from 'react';
import UserList from './UserList';
import Pagination from '@/components/fragments/Pagination';
import UserFormModal from './UserFormModal';

export default function AdminUserDisplay() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [pagination, setPagination] = useState<IPaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // State untuk modal form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        const result = await fetchAllUsers(currentPage, 10);
        if (result.status === 'success' && result.data) {
            const extractedUsers = result.data.data.map(item => item.user);

            setUsers(extractedUsers);
            setPagination(result.data.pagination);
        } else {
            console.error(result.message);
        }
        setLoading(false);
    }, [currentPage]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleOpenCreateModal = () => {
        setEditingUser(null); // Pastikan null untuk mode 'create'
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
            // Mode Update
            result = await updateUserProfile(editingUser._id!, formData as IUpdateUserPayload);
        } else {
            // Mode Create
            result = await createUser(formData as ICreateUserPayload);
        }

        if (result.status === 'success') {
            alert(`User successfully ${editingUser ? 'updated' : 'created'}!`);
            handleCloseModal();
            loadUsers(); // Refresh data
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        const result = await softDeleteUser(userId);
        if (result.status === 'success') {
            alert(result.message);
            loadUsers(); // Refresh data
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 mt-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-extrabold text-gray-900">User List</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    Create New User
                </button>
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
                    {pagination && pagination.totalPages > 1 && (
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
