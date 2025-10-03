import { ITransaction } from '@/types/Transaction';
import { IPaginatedResponse } from '../user';

export interface ICreateTransactionPayload {
  tickets: {
    ticketId: string;
    quantity: number;
  }[];
  transactionMethod: 'Online' | 'Onsite';
  userId?: string;
  isComplimentary?: boolean;
  paymentProof: File | null;
  totalPrice: number;
}

export interface IVerifyTransactionPayload {
  status: 'paid' | 'reject';
}

export interface IUpdateTransactionStatusPayload {
  status: 'pending' | 'paid';
}

export interface IExportedTransaction {
  'Nama Pembeli': string;
  Email: string;
  'Nomor Hp': string;
  'Jumlah Tiket': number;
  'Total Bayar': number;
  Status: string;
  Metode: string;
  'Tanggal Pembelian': string;
}

export async function fetchWithToken(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const headers: HeadersInit = { ...(options?.headers || {}) };
  if (!(options?.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  return response;
}

export async function createTransaction(
  payload: ICreateTransactionPayload
): Promise<{
  status: string;
  message: string;
  data: Partial<ITransaction> | null;
}> {
  try {
    const formData = new FormData();

    // tickets array stringify
    formData.append('tickets', JSON.stringify(payload.tickets));
    formData.append('transactionMethod', payload.transactionMethod);
    formData.append('totalPrice', payload.totalPrice.toString());
    formData.append('isComplimentary', String(payload.isComplimentary));

    if (payload.userId) {
      formData.append('userId', payload.userId);
    }

    if (payload.paymentProof) {
      formData.append('paymentProof', payload.paymentProof);
    }

    const res = await fetchWithToken('/transaction', {
      method: 'POST',
      body: formData, // 👈 kirim FormData
    });

    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal membuat transaksi.');

    return {
      status: 'success',
      message: responseData.message,
      data: responseData,
    };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function fetchAllTransactions(
  page: number = 1,
  limit: number = 10,
  status?: 'expired' | 'pending' | 'paid' | 'reject',
  q?: string
): Promise<{
  status: string;
  message: string;
  data: IPaginatedResponse<ITransaction> | null;
}> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) params.append('status', status);
    if (q) params.append('q', q);

    const res = await fetchWithToken(`/transaction?${params.toString()}`, {
      method: 'GET',
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal mengambil data transaksi.');

    return {
      status: 'success',
      message: responseData.message,
      data: responseData,
    };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function fetchTransactionById(transactionId: string): Promise<{
  status: 'success' | 'error';
  message: string;
  data: ITransaction | null;
}> {
  try {
    const res = await fetchWithToken(`/transaction/${transactionId}`, {
      method: 'GET',
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Transaksi tidak ditemukan.');

    return {
      status: 'success',
      message: responseData.message,
      data: responseData.data,
    };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function verifyTransaction(
  transactionId: string,
  payload: IVerifyTransactionPayload
): Promise<{ status: string; message: string; data: ITransaction | null }> {
  try {
    const res = await fetchWithToken(`/transaction/${transactionId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal memverifikasi transaksi.');

    return {
      status: 'success',
      message: responseData.message,
      data: responseData.data,
    };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function softDeleteTransaction(
  transactionId: string
): Promise<{ status: 'success' | 'error'; message: string }> {
  try {
    const res = await fetchWithToken(`/transaction/${transactionId}`, {
      method: 'DELETE',
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal menghapus transaksi.');

    return { status: 'success', message: responseData.message };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}

export async function fetchAllTransactionsForExport(
  status?: string,
  searchQuery?: string
): Promise<{
  status: string;
  message: string;
  data: IExportedTransaction[] | null;
}> {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    const res = await fetchWithToken(
      `/transaction/export/all?${params.toString()}`,
      {
        method: 'GET',
      }
    );
    const responseData = await res.json();
    if (!res.ok) {
      throw new Error(responseData.message || 'Gagal mengekspor data transaksi.');
    }
    return responseData;
  } catch (error: any) {
    return { status: 'error', data: null, message: error.message };
  }
}

export async function revertTransaction(transactionId: string): Promise<{ status: string; message: string; data: ITransaction | null }> {
  try {
    const res = await fetchWithToken(`/transaction/${transactionId}/revert`, {
      method: 'PATCH'
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal revert transaksi.');

    return {
      status: 'success',
      message: responseData.message,
      data: responseData.data,
    };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function updateTransactionStatus(
  transactionId: string,
  payload: IUpdateTransactionStatusPayload
): Promise<{ status: string; message: string; data: ITransaction | null }> {
  try {
    const res = await fetchWithToken(`/transaction/${transactionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal mengupdate status transaksi.');

    return {
      status: 'success',
      message: responseData.message,
      data: responseData.data,
    };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}
