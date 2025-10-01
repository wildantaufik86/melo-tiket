import { ITransaction } from "@/types/Transaction";
import { IUser } from "@/types/User";

export interface ICreateUserPayload {
  email: string;
  name: string;
  idNumber: number;
  password?: string;
  role: "user" | "admin" | "superadmin";
}

export type IUpdateUserPayload = Partial<Omit<IUser, '_id' | 'historyTransaction'>>;

export interface ICreateTransactionPayload {
  tickets: {
    ticketId: string;
    quantity: number;
  }[];
  transactionMethod: "Transfer Bank" | "Onsite" | "E-Wallet";
  userId?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    limit: number;
  };
}

export async function fetchWithToken(url: string, options?: RequestInit): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const headers: HeadersInit = { ...(options?.headers || {}) };
  if (!(options?.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
    credentials: 'include'
  });
  return response;
}

export async function fetchAllUsers(page: number = 1, limit: number = 10): Promise<{ status: string; message: string; data: IPaginatedResponse<IUser> | null }> {
  try {
    const res = await fetchWithToken(`/user?page=${page}&limit=${limit}`, { method: 'GET' });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal mengambil data pengguna.');

    return { status: 'success', message: responseData.message, data: responseData };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function fetchUserById(userId: string): Promise<{ status: 'success' | 'error'; message: string; data: IUser | null }> {
  try {
    const res = await fetchWithToken(`/user/${userId}`, { method: 'GET' });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Pengguna tidak ditemukan.');

    return { status: 'success', message: responseData.message, data: responseData.data };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function createUser(payload: ICreateUserPayload): Promise<{ status: string; message: string; data: IUser | null }> {
  try {
    const res = await fetchWithToken('/user/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal membuat pengguna.');

    return { status: 'success', message: responseData.message, data: responseData.data };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function updateUserProfile(userId: string, payload: IUpdateUserPayload): Promise<{ status: string; message: string; data: IUser | null }> {
  try {
    const res = await fetchWithToken(`/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal memperbarui profil pengguna.');

    return { status: 'success', message: responseData.message, data: responseData.data };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function softDeleteUser(userId: string): Promise<{ status: 'success' | 'error'; message: string; }> {
  try {
    const res = await fetchWithToken(`/user/${userId}`, { method: 'DELETE' });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal menghapus pengguna.');

    return { status: 'success', message: responseData.message };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}

export async function createUserTransaction(payload: ICreateTransactionPayload): Promise<{ status: string; message: string; data: Partial<ITransaction> | null }> {
  try {
    const res = await fetchWithToken('/user/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal membuat transaksi.');

    return { status: 'success', message: responseData.message, data: responseData };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function searchUsers(query: string): Promise<{ status: 'success' | 'error'; data: IUser[] | null; message: string }> {
    try {
        const res = await fetchWithToken(`/user/search?q=${query}`, { method: 'GET' });
        const responseData = await res.json();
        if (!res.ok) throw new Error(responseData.message || 'Gagal mencari pengguna.');

        return { status: 'success', data: responseData.data, message: 'Pengguna berhasil ditemukan' };
    } catch (error: any) {
        return { status: 'error', data: null, message: error.message };
    }
}


// app/api/user.ts atau sejenisnya

export async function fetchAllUsersForExport(): Promise<{ status: string; message: string; data: IUser[] | null }> {
    try {
        // PERBAIKAN 1: URL disesuaikan menjadi '/user/export/all'
        const res = await fetchWithToken(`/user/export/all`, { method: 'GET' });
        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.message || 'Gagal mengekspor data pengguna.');
        }

        // PERBAIKAN 2: Kembalikan seluruh objek respons, bukan hanya responseData.data
        return responseData;
    } catch (error: any) {
        return { status: 'error', data: null, message: error.message };
    }
}
