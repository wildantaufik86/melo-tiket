import { ICategory } from "@/types/Category";

export interface ICreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export type IUpdateCategoryPayload = Partial<ICreateCategoryPayload>;

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

export async function fetchAllCategories(): Promise<{ status: string; message: string; data: ICategory[] | null }> {
  try {
    const res = await fetchWithToken('/categories', { method: 'GET' });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal mengambil data kategori.');

    return { status: 'success', message: responseData.message, data: responseData.data };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function fetchCategoryById(categoryId: string): Promise<{ status: 'success' | 'error'; message: string; data: ICategory | null }> {
  try {
    const res = await fetchWithToken(`/categories/${categoryId}`, { method: 'GET' });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Kategori tidak ditemukan.');

    return { status: 'success', message: responseData.message, data: responseData.data };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function createCategory(payload: ICreateCategoryPayload): Promise<{ status: string; message: string; data: ICategory | null }> {
  try {
    const res = await fetchWithToken('/categories/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal membuat kategori.');

    return { status: 'success', message: responseData.message, data: responseData.data };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function updateCategory(categoryId: string, payload: IUpdateCategoryPayload): Promise<{ status: string; message: string; data: ICategory | null }> {
  try {
    const res = await fetchWithToken(`/categories/update/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal memperbarui kategori.');

    return { status: 'success', message: responseData.message, data: responseData.data };
  } catch (error: any) {
    return { status: 'error', message: error.message, data: null };
  }
}

export async function softDeleteCategory(categoryId: string): Promise<{ status: 'success' | 'error'; message: string; }> {
  try {
    const res = await fetchWithToken(`/categories/${categoryId}`, { method: 'DELETE' });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || 'Gagal menghapus kategori.');

    return { status: 'success', message: responseData.message };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}
