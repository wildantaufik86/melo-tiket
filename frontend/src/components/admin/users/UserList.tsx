'use client';

import { useAuth } from '@/context/authUserContext';
import { IUser } from '@/types/User';
import { getStatusClass } from '@/utils/statusHelper';
import { PencilIcon, TrashIcon } from '@phosphor-icons/react';

interface UserListProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (userId: string) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  const { authUser } = useAuth();

  return (
    <div className="overflow-x-auto mb-5">
      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700 uppercase">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">ID Number</th>
            <th className="py-3 px-4 text-center">Role</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.idNumber}</td>
              <td className="py-3 px-4 text-center">
                <span className={`${getStatusClass(user.role)} text-sm`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex item-center justify-center space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <PencilIcon size={16} />
                  </button>
                  {authUser?.role === 'superadmin' && (
                    <button
                      onClick={() => onDelete(user._id!)}
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <TrashIcon size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
