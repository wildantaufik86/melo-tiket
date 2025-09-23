'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
  const [totalPortofolioItems, setTotalPortofolioItems] = useState(0);
  // const [latestPosts, setLatestPosts] = useState<IPost[]>([]);
  // const [latestPortofolioItems, setLatestPortofolioItems] = useState<IPortofolio[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const postsResult = await fetchPosts({ page: 1, limit: 5 });
  //       if (postsResult.status === 'success' && postsResult.data) {
  //         setTotalPosts(postsResult.pagination?.totalPosts || 0);
  //         const processedPosts = postsResult.data.map(post => ({
  //           ...post,
  //           categoryNameForDisplay: typeof post.categoryId === 'object' && post.categoryId !== null
  //             ? (post.categoryId as unknown as ICategory).name
  //             : 'Tidak Berkategori'
  //         }));
  //         setLatestPosts(processedPosts);
  //       } else {
  //         console.error('Failed to fetch posts for dashboard:', postsResult.message);
  //       }

  //       const categoriesResult = await fetchCategories();
  //       if (categoriesResult.status === 'success' && categoriesResult.data) {
  //         setTotalCategories(categoriesResult.data.length);
  //       } else {
  //         console.error('Failed to fetch categories for dashboard:', categoriesResult.message);
  //       }

  //       const portofolioResult = await fetchPortofolioItems({ page: 1, limit: 5 }); // Fetch top 5 latest portofolio items
  //       if (portofolioResult.status === 'success' && portofolioResult.data) {
  //         setTotalPortofolioItems(portofolioResult.pagination?.totalItems || 0);
  //         setLatestPortofolioItems(portofolioResult.data);
  //       } else {
  //         console.error('Failed to fetch portofolio for dashboard:', portofolioResult.message);
  //       }

  //     } catch (error: any) {
  //       console.error('Error fetching dashboard data:', error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  if (isLoading) {
    return (
      <div className="mt-16 flex flex-col px-8 min-h-[400px] items-center justify-center">
        <p className="text-xl text-gray-700">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <React.Fragment>

    </React.Fragment>
  );
}
