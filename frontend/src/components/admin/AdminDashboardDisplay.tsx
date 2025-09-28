"use client";

import { fetchDashboardSummary } from "@/app/api/dashboard";
import { useAuth } from "@/context/authUserContext";
import { useEffect, useState } from "react";

interface DashboardSummary {
  users: {
    total: number;
    male: number;
    female: number;
  };
  events: number;
  tickets: {
    total: number;
    stockPerCategory: Array<{
      _id: string;
      categoryName: string;
      totalStock: number;
    }>;
    soldPerCategory: Array<{
      _id: string;
      categoryName: string;
      totalSold: number;
      totalRevenue: number;
    }>;
  };
  transactions: {
    total: number;
    paid: number;
    pending: number;
    rejected: number;
    expired: number;
    perCategory: Array<{
      _id: string;
      categoryName: string;
      totalAmount: number;
      totalTransactions: number;
    }>;
  };
  totalRevenue: number;
}

export default function AdminDashboardDisplay() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authUser = useAuth();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const res = await fetchDashboardSummary();
        if (res?.data) {
          setSummary(res.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (

    <div className="p-6 space-y-6">
      {authUser?.authUser?.role === 'superadmin' && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-gray-600 mt-2">Ringkasan data keseluruhan sistem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium opacity-90">Total Users</h2>
                  <p className="text-3xl font-bold">{summary.users.total.toLocaleString()}</p>
                </div>
                <div className="text-blue-200">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Events */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium opacity-90">Total Events</h2>
                  <p className="text-3xl font-bold">{summary.events}</p>
                </div>
                <div className="text-green-200">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Tickets */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium opacity-90">Total Tickets</h2>
                  <p className="text-3xl font-bold">{summary.tickets.total}</p>
                </div>
                <div className="text-purple-200">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium opacity-90">Total Revenue</h2>
                  <p className="text-3xl font-bold">Rp {summary.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="text-orange-200">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Demographics */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Demographics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold text-lg">{summary.users.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Laki-laki</span>
                  <span className="font-semibold text-blue-600">{summary.users.male.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Perempuan</span>
                  <span className="font-semibold text-pink-600">{summary.users.female.toLocaleString()}</span>
                </div>
              </div>

              {/* Gender Distribution Chart */}
              <div className="mt-4">
                <div className="flex rounded-full overflow-hidden h-3 bg-gray-200">
                  <div
                    className="bg-blue-500"
                    style={{ width: `${(summary.users.male / summary.users.total) * 100}%` }}
                  ></div>
                  <div
                    className="bg-pink-500"
                    style={{ width: `${(summary.users.female / summary.users.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{((summary.users.male / summary.users.total) * 100).toFixed(1)}% Male</span>
                  <span>{((summary.users.female / summary.users.total) * 100).toFixed(1)}% Female</span>
                </div>
              </div>
            </div>

            {/* Transaction Status */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold text-lg">{summary.transactions.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600">Paid</span>
                  <span className="font-semibold text-green-600">{summary.transactions.paid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{summary.transactions.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600">Rejected</span>
                  <span className="font-semibold text-red-600">{summary.transactions.rejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Expired</span>
                  <span className="font-semibold text-gray-500">{summary.transactions.expired}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Stock by Category */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ticket Stock per Category</h2>
              <div className="space-y-3">
                {summary.tickets.stockPerCategory.length > 0 ? (
                  summary.tickets.stockPerCategory.map((item, i) => (
                    <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">{item.categoryName}</span>
                      <span className="font-bold text-blue-600">{item.totalStock.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No stock data available</p>
                )}
              </div>
            </div>

            {/* Tickets Sold by Category */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tickets Sold per Category</h2>
              <div className="space-y-3">
                {summary.tickets.soldPerCategory.length > 0 ? (
                  summary.tickets.soldPerCategory.map((item, i) => (
                    <div key={item._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{item.categoryName}</span>
                        <span className="font-bold text-green-600">{item.totalSold.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Revenue: Rp {item.totalRevenue.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No sales data available</p>
                )}
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue per Category</h2>
              <div className="space-y-3">
                {summary.transactions.perCategory.length > 0 ? (
                  summary.transactions.perCategory.map((item, i) => (
                    <div key={item._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{item.categoryName}</span>
                        <span className="font-bold text-orange-600">
                          Rp {item.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.totalTransactions} transactions
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No transaction data available</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Total Revenue Summary</h2>
            <p className="text-3xl font-bold">
              Rp {summary.totalRevenue.toLocaleString()}
            </p>
            <p className="text-gray-300 mt-2">
              From {summary.transactions.paid} paid transactions
            </p>
          </div>
        </>
      )}
    </div>
  );
}
