import { ICategory } from "@/types/Category";
import { PencilIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

interface CategoryListProps {
  categories: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (id: string) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
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
                  <td className="py-3 px-6 whitespace-nowrap font-medium text-gray-800">{category.name}</td>
                  <td className="py-3 px-6 font-mono text-xs">{category.slug}</td>
                  <td className="py-3 px-6 max-w-xs truncate">{category.description || '-'}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                        aria-label="Edit"
                      >
                        <PencilIcon size={16} weight="light" />
                      </button>
                      <button
                        type="button"
                        onClick={() => category._id && onDelete(category._id)}
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-md"
                        aria-label="Delete"
                      >
                        <TrashIcon size={16} weight="light" />
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
  );
}
