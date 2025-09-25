'use client'

import { createCategory, fetchAllCategories, softDeleteCategory, updateCategory } from "@/app/api/categories";
import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { ICategory } from "@/types/Category";
import { TicketIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

export default function CategoryAdminDisplay() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const breadcrumbItems: BreadCrumbItem[] = [
    {
      label: "Event Managements",
      href: "/admin/homepage",
      icon: <TicketIcon size={16} className='text-black/75' weight="light" />
    },
    {
      label: "Form Category"
    }
  ];

  const loadCategories = async () => {
    setLoading(true);
    setMessage('');
    const result = await fetchAllCategories();
    if (result.status === 'success' && result.data) {
      setCategories(result.data);
    } else {
      setMessage(`Error fetching categories: ${result.message}`);
      console.error('Failed to fetch categories:', result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateOrUpdate = async (formData: ICategory) => {
    setSaving(true);
    setMessage('');

    const actionIsUpdate = editingCategory && editingCategory._id;
    let result;

    if (actionIsUpdate) {
      const updatedData = { ...editingCategory, ...formData };
      result = await updateCategory(editingCategory._id!, updatedData);
    } else {
      result = await createCategory(formData);
    }

    if (result.status === 'success') {
      setMessage(`Kategori berhasil ${actionIsUpdate ? 'diperbarui' : 'dibuat'}!`);
      setEditingCategory(null);
      loadCategories();
    } else {
      setMessage(`Error: ${result.message}`);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    setSaving(true);
    setMessage('');
    const result = await softDeleteCategory(id);
    if (result.status === 'success') {
      setMessage('Kategori berhasil dihapus!');
      loadCategories();
    } else {
      setMessage(`Error deleting category: ${result.message}`);
    }
    setSaving(false);
  };

  const startEditing = (category: ICategory) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-medium text-gray-700">Memuat Kategori...</div>
      </div>
    );
  }

  return (
    <section>
      <BreadCrumb items={breadcrumbItems} />
      <div className='w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 flex justify-center items-center'>
        <div className="w-full max-w-2xl">
          <p className="text-xl font-extrabold mb-8 text-start text-gray-900">Management Category</p>

          {message && (
            <div className={`mb-6 p-4 rounded-md text-center font-medium ${message.startsWith('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
              {message}
            </div>
          )}

          <CategoryForm
            key={editingCategory?._id || 'new'}
            editingCategory={editingCategory}
            onSave={handleCreateOrUpdate}
            onCancel={cancelEditing}
            isSaving={saving}
          />

          <CategoryList
            categories={categories}
            onEdit={startEditing}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </section>
  )
};
