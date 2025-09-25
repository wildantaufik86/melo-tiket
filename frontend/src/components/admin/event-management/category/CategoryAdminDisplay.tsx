'use client'

import { createCategory, fetchAllCategories, softDeleteCategory, updateCategory } from "@/app/api/categories";
import InputContainer from "@/components/fragments/inputContainer/InputContainer";
import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { ICategory } from "@/types/Category";
import { PencilIcon, PlusIcon, TicketIcon, TrashIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

export default function CategoryAdminDisplay() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
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

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setMessage('');
    const result = await fetchAllCategories();
    if (result.status === 'success' && result.data) {
      setCategories(result.data);
    }
     else {
      setMessage(`Error fetching categories: ${result.message}`);
      console.error('Failed to fetch categories:', result.message);
    }
    setLoading(false);
  };

  const handleCreateOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (editingCategory) {
      const updatedData: ICategory = {
        ...editingCategory,
        name: newCategoryName,
        slug: newCategorySlug,
        description: newCategoryDescription,
      };
      if (!editingCategory._id) {
        setMessage("Error: ID kategori tidak ditemukan untuk diperbarui.");
        setSaving(false);
        return;
      }
      const result = await updateCategory(editingCategory._id, updatedData);
      if (result.status === 'success') {
        setMessage('Kategori berhasil diperbarui!');
        setEditingCategory(null);
        resetForm();
        loadCategories();
      } else {
        setMessage(`Error updating category: ${result.message}`);
      }
    } else {
      const newCategory: ICategory = {
        name: newCategoryName,
        slug: newCategorySlug,
        description: newCategoryDescription,
      };
      const result = await createCategory(newCategory);
      if (result.status === 'success') {
        setMessage('Kategori berhasil dibuat!');
        resetForm();
        loadCategories();
      } else {
        setMessage(`Error creating category: ${result.message}`);
      }
    }
    setSaving(false);
  };

  const handleDeleteCategory = async (id: string) => {
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
    setNewCategoryName(category.name);
    setNewCategorySlug(category.slug);
    setNewCategoryDescription(category.description || '');
  };

  const resetForm = () => {
    setNewCategoryName('');
    setNewCategorySlug('');
    setNewCategoryDescription('');
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
    <section className="">
      <BreadCrumb items={breadcrumbItems} />
      <div className='w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200 flex justify-center items-center'>
        <div className="w-full max-w-2xl">
          <p className="text-xl font-extrabold mb-8 text-start text-gray-900">Management Category</p>

          {/* Area Pesan (Success/Error) */}
          {message && (
            <div className={`mb-6 p-4 rounded-md text-center font-medium ${message.startsWith('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
              {message}
            </div>
          )}

          {/* Form Tambah/Edit Kategori */}
          <section className="p-6 rounded-lg shadow-sm border border-gray-200 mb-10">
            <p className="text-md font-bold mb-5 text-gray-800">{editingCategory ? 'Edit Category' : 'Add New Category'}</p>
            <form onSubmit={handleCreateOrUpdateCategory} className="space-y-6">
              <InputContainer
                type="text"
                name="Category Name"
                value={newCategoryName}
                setValue={setNewCategoryName}
                placeholder="Nama Kategori (e.g., Branding)"
                required
              />
              <InputContainer
                type="text"
                name="Category Slug"
                value={newCategorySlug}
                setValue={setNewCategorySlug}
                placeholder="Slug Kategori (e.g., branding-news)"
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="categoryDescription">Category Description (Optional)</label>
                <textarea
                  id="categoryDescription"
                  name="categoryDescription"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="focus:outline-none text-sm bg-bg-secondary border border-black/30 px-2 py-1 rounded-sm"
                  placeholder="Deskripsi singkat untuk kategori"
                ></textarea>
              </div>
              {/* Tombol Aksi Form (Batal, Perbarui/Tambah) */}
              <div className="flex justify-end gap-4">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-700 transition-colors shadow-md flex justify-center items-center gap-2"
                    disabled={saving}
                  >
                    <XIcon size={16} color="#fafafa" weight="bold" />
                    <span>Cancel</span>
                  </button>
                )}
                <button
                  type="submit"
                className="max-w-fit px-3 py-1.5 bg-blue-600 text-white text-md rounded-md hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto flex justify-center items-center gap-2" disabled={saving}
              >
                  <PlusIcon size={16} color="#fafafa" weight="light" />
                  <span className="text-sm">{saving ? (editingCategory ? 'Memperbarui...' : 'Membuat...') : (editingCategory ? 'Perbarui Kategori' : 'Tambah Kategori')}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Daftar Kategori */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-md font-bold mb-5 text-gray-800">List Category</p>
            {categories.length === 0 ? (
              <p className="text-center text-gray-600">Belum ada kategori. Silakan tambahkan satu di atas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 border-b border-gray-200">Name</th>
                      <th className="py-3 px-6 border-b border-gray-200">Slug</th>
                      <th className="py-3 px-6 border-b border-gray-200">Description</th>
                      <th className="py-3 px-6 border-b border-gray-200 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {categories.map((category) => (
                      <tr key={category._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 whitespace-nowrap">{category.name}</td>
                        <td className="py-3 px-6">{category.slug}</td>
                        <td className="py-3 px-6 max-w-xs truncate">{category.description || '-'}</td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => startEditing(category)}
                              className="max-w-fit px-2 py-2 bg-blue-600 text-white text-md rounded-md hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
                              >
                                <PencilIcon size={16} color="#fafafa" weight="light" />
                            </button>
                            <button
                              type="button"
                              onClick={() => category._id && handleDeleteCategory(category._id)}
                              className="max-w-fit px-2 py-2 bg-red-600 text-white text-md rounded-md hover:bg-red-700 transition-colors shrink-0 w-full sm:w-auto"
                              >
                                <TrashIcon size={16} color="#fafafa" weight="light" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
};
