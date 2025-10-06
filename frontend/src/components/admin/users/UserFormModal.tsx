'use client';

import { ICreateUserPayload, IUpdateUserPayload } from '@/app/api/user';
import { useAuth } from '@/context/authUserContext';
import { IUser } from '@/types/User';
import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ICreateUserPayload | IUpdateUserPayload) => void;
  editingUser: IUser | null;
}

type Role = 'user' | 'admin' | 'superadmin';

type FormState = {
  name: string;
  email: string;
  idNumber: string;
  role: Role;
  password: string;
};

export default function UserFormModal({
  isOpen,
  onClose,
  onSave,
  editingUser,
}: ModalProps) {
  const initialState: FormState = {
    name: '',
    email: '',
    idNumber: '',
    role: 'user',
    password: '',
  };

  const [formData, setFormData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const { authUser } = useAuth();
  const isEditMode = !!editingUser;

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        idNumber: String(editingUser.idNumber),
        role: editingUser.role,
        password: '', // Password tidak diisi saat edit
      });
    } else {
      setFormData(initialState);
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: any = {
      name: formData.name,
      email: formData.email,
      idNumber: Number(formData.idNumber),
      role: formData.role,
    };

    // Hanya kirim password jika diisi (untuk create atau edit yang ingin ganti password)
    if (formData.password && formData.password.trim() !== '') {
      payload.password = formData.password;
    }

    await onSave(payload);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold">
            {isEditMode ? 'Edit User' : 'Create New User'}
          </h2>
          <button onClick={onClose} className="text-2xl font-bold">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ID Number (KTP/SIM)</label>
            <input
              type="number"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          {authUser?.role === 'superadmin' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Password {isEditMode && <span className="text-gray-500 text-xs">(optional)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder={
                  isEditMode ? 'Leave blank to keep current password' : 'Enter password'
                }
                required={!isEditMode}
              />
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Only fill this if you want to change the password
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
