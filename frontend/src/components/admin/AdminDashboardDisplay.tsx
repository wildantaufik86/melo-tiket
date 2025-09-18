'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IPost } from '@/types/post';
import { ICategory } from '@/types/category';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { IPortofolio } from '@/types/portofolio';
import { fetchCategories, fetchPosts } from '@/app/api/post';
import { fetchPortofolioItems } from '@/app/api/portofolio';

const formattedDate = (dateString: Date | string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminDashbordDisplay() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalPortofolioItems, setTotalPortofolioItems] = useState(0); // New state for total portofolio
  const [latestPosts, setLatestPosts] = useState<IPost[]>([]);
  const [latestPortofolioItems, setLatestPortofolioItems] = useState<IPortofolio[]>([]); // New state for latest portofolio

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Posts summary
        const postsResult = await fetchPosts({ page: 1, limit: 5 });
        if (postsResult.status === 'success' && postsResult.data) {
          setTotalPosts(postsResult.pagination?.totalPosts || 0);
          const processedPosts = postsResult.data.map(post => ({
            ...post,
            categoryNameForDisplay: typeof post.categoryId === 'object' && post.categoryId !== null
              ? (post.categoryId as unknown as ICategory).name
              : 'Tidak Berkategori'
          }));
          setLatestPosts(processedPosts);
        } else {
          console.error('Failed to fetch posts for dashboard:', postsResult.message);
        }

        // Fetch Categories summary
        const categoriesResult = await fetchCategories();
        if (categoriesResult.status === 'success' && categoriesResult.data) {
          setTotalCategories(categoriesResult.data.length);
        } else {
          console.error('Failed to fetch categories for dashboard:', categoriesResult.message);
        }

        // Fetch Portofolio summary (NEW)
        const portofolioResult = await fetchPortofolioItems({ page: 1, limit: 5 }); // Fetch top 5 latest portofolio items
        if (portofolioResult.status === 'success' && portofolioResult.data) {
          setTotalPortofolioItems(portofolioResult.pagination?.totalItems || 0);
          setLatestPortofolioItems(portofolioResult.data);
        } else {
          console.error('Failed to fetch portofolio for dashboard:', portofolioResult.message);
        }

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-16 flex flex-col px-8 min-h-[400px] items-center justify-center">
        <p className="text-xl text-gray-700">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="mt-16 flex flex-col px-8">
        <div className="flex flex-col">
          <h3 className="text-5xl font-bold text-gray-900">Selamat Datang, Admin!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Card: Total Posts */}
            <div className="flex flex-col bg-white p-6 border border-slate-200 shadow-md rounded-lg">
              <p className="flex justify-between items-center text-lg font-medium text-gray-700">
                Total Berita{' '}
                <span className="flex items-center gap-2 text-green-500">
                  <TrendingUp size={20} />
                </span>
              </p>
              <p className="text-4xl font-semibold text-gray-900 mt-4">{totalPosts}</p>
              <p className="text-black/75 text-sm mt-1">Berita Diterbitkan</p>
            </div>

            {/* Card: Total Categories */}
            <div className="flex flex-col bg-white p-6 border border-slate-200 shadow-md rounded-lg">
              <p className="flex justify-between items-center text-lg font-medium text-gray-700">
                Total Kategori{' '}
                <span className="flex items-center gap-2 text-red-500">
                  <TrendingDown size={20} />
                </span>
              </p>
              <p className="text-4xl font-semibold text-gray-900 mt-4">{totalCategories}</p>
              <p className="text-black/75 text-sm mt-1">Kategori Berita</p>
            </div>

            {/* Card: Total Portofolio Items (UPDATED) */}
            <div className="flex flex-col bg-white text-gray-900 p-6 border border-slate-200 shadow-md rounded-lg">
              <p className="flex justify-between items-center text-lg font-medium">
                Total Portofolio{' '}
                <span className="flex items-center gap-2 text-green-500">
                  <TrendingUp size={20} />
                </span>
              </p>
              <p className="text-4xl font-semibold mt-4">{totalPortofolioItems}</p>
              <p className="text-sm mt-1">Item Portofolio</p>
            </div>
          </div>
        </div>

        {/* Latest Posts Section */}
        <div className="flex flex-col mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-gray-800">Berita Terbaru</h3>
            <Link
              href={'/admin/post'}
              className="bg-indigo-700 text-white text-sm py-2 px-4 rounded-md shadow-sm hover:bg-indigo-800 transition-colors"
            >
              Lihat Semua Berita
            </Link>
          </div>
          {latestPosts.length > 0 ? (
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 border-b border-gray-200">Judul</th>
                    <th className="py-3 px-6 border-b border-gray-200">Kategori</th>
                    <th className="py-3 px-6 border-b border-gray-200">Penulis</th>
                    <th className="py-3 px-6 border-b border-gray-200">Tanggal</th>
                    <th className="py-3 px-6 border-b border-gray-200 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {latestPosts.map((post) => (
                    <tr key={post._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 font-medium">{post.title}</td>
                      <td className="py-3 px-6">{((post as any).categoryNameForDisplay) || 'Tidak Berkategori'}</td>
                      <td className="py-3 px-6">{post.author}</td>
                      <td className="py-3 px-6">{formattedDate(post.publishedAt)}</td>
                      <td className="py-3 px-6 text-center">
                        <Link
                          href={`/admin/post?id=${post._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center font-semibold text-xl text-gray-600 py-10">
              Belum ada berita terbaru.
            </p>
          )}
        </div>

        {/* Latest Portofolio Items Section (NEW) */}
        <div className="flex flex-col mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-gray-800">Item Portofolio Terbaru</h3>
            <Link
              href={'/admin/portofolio'}
              className="bg-indigo-700 text-white text-sm py-2 px-4 rounded-md shadow-sm hover:bg-indigo-800 transition-colors"
            >
              Lihat Semua Portofolio
            </Link>
          </div>
          {latestPortofolioItems.length > 0 ? (
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 border-b border-gray-200">Judul Proyek</th>
                    <th className="py-3 px-6 border-b border-gray-200">Klien</th>
                    <th className="py-3 px-6 border-b border-gray-200">Tanggal Dibuat</th>
                    <th className="py-3 px-6 border-b border-gray-200 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {latestPortofolioItems.map((item) => (
                    <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 font-medium">{item.title}</td>
                      <td className="py-3 px-6">{item.clientName}</td>
                      <td className="py-3 px-6">{formattedDate(item.createdAt || '')}</td>
                      <td className="py-3 px-6 text-center">
                        <Link
                          href={`/admin/portofolio?id=${item._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center font-semibold text-xl text-gray-600 py-10">
              Belum ada item portofolio terbaru.
            </p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
