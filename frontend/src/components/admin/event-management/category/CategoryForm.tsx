import { ICategory } from "@/types/Category";
import { PlusIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import InputContainer from "@/components/fragments/inputContainer/InputContainer"; // Pastikan path ini benar

interface CategoryFormProps {
  editingCategory: ICategory | null;
  onSave: (categoryData: Omit<ICategory, '_id'>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function CategoryForm({ editingCategory, onSave, onCancel, isSaving }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSlug(editingCategory.slug);
      setDescription(editingCategory.description || '');
    } else {
      setName('');
      setSlug('');
      setDescription('');
    }
  }, [editingCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
        alert("Nama Kategori dan Slug tidak boleh kosong.");
        return;
    }
    onSave({ name, slug, description });
  };

  return (
    <section className="p-6 rounded-lg shadow-sm border border-gray-200 mb-10">
      <p className="text-md font-bold mb-5 text-gray-800">{editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputContainer
          type="text"
          name="Category Name"
          value={name}
          setValue={setName}
          placeholder="Nama Kategori (e.g., Branding)"
          required
        />
        <InputContainer
          type="text"
          name="Category Slug"
          value={slug}
          setValue={setSlug}
          placeholder="Slug Kategori (e.g., branding-news)"
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor="categoryDescription">Category Description (Optional)</label>
          <textarea
            id="categoryDescription"
            name="categoryDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="focus:outline-none text-sm bg-gray-50 border border-black/30 px-2 py-1 rounded-sm w-full"
            placeholder="Deskripsi singkat untuk kategori"
            rows={3}
          ></textarea>
        </div>
        <div className="flex justify-end gap-4">
          {editingCategory && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors shadow-md flex justify-center items-center gap-2"
              disabled={isSaving}
            >
              <XIcon size={16} color="#fafafa" weight="bold" />
              <span>Cancel</span>
            </button>
          )}
          <button
            type="submit"
            className="max-w-fit px-3 py-1.5 bg-blue-600 text-white text-md rounded-md hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto flex justify-center items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            <PlusIcon size={16} color="#fafafa" weight="light" />
            <span className="text-sm">{isSaving ? (editingCategory ? 'Memperbarui...' : 'Menyimpan...') : (editingCategory ? 'Perbarui Kategori' : 'Tambah Kategori')}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
