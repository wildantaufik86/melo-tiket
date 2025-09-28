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
      setFormData({
        name: '',
        email: '',
        idNumber: '',
        role: 'user',
        password: '',
      });
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

    const payload = {
      ...formData,
      idNumber: Number(formData.idNumber),
    };

    // Hapus password dari payload jika tidak diisi saat edit
    if (isEditMode && !payload.password) {
      delete (payload as any).password;
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
            <label>Name</label>
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
            <label>Email</label>
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
            <label>ID Number (KTP/SIM)</label>
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
            <label>Role</label>
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
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder={
                  isEditMode ? 'Leave blank to keep current password' : ''
                }
                required={!isEditMode}
              />
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
