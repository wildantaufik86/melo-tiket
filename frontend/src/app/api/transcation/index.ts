import { ITransaction } from '@/types/Transaction';
import { IPaginatedResponse } from '../user';

export interface ICreateTransactionPayload {
  tickets: {
    ticketId: string;
    quantity: number;
  }[];
  transactionMethod: 'Online' | 'Onsite';
  userId?: string;
  paymentProof: File | null;
  totalPrice: number;
}

export interface IVerifyTransactionPayload {
  status: 'paid' | 'reject';
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
  status?: 'expired' | 'pending' | 'paid' | 'reject'
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
    if (status) {
      params.append('status', status);
    }

    const res = await fetchWithToken(`/transaction?${params.toString()}`, {
      method: 'GET',
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(
        responseData.message || 'Gagal mengambil data transaksi.'
      );

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
