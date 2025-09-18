import { IPortofolio } from "@/types/portofolio";

export async function fetchWithToken(url: string, options?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('authToken'); // Dapatkan token otentikasi Anda dari penyimpanan lokal

  const headers = {
    ...options?.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Tambahkan header otorisasi jika token ada
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Mengambil item portofolio dari backend dengan paginasi.
 * @param {object} params - Query parameters.
 * @param {number} [params.page=1] - Nomor halaman.
 * @param {number} [params.limit=10] - Jumlah item per halaman.
 * @returns {Promise<{status: string, message: string, data: IPortofolio[] | null, pagination?: any}>}
 */
export async function fetchPortofolioItems({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}): Promise<{ status: string; message: string; data: IPortofolio[] | null; pagination?: any }> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const res = await fetchWithToken(`/portofolio?${queryParams.toString()}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Item portofolio berhasil diambil!', data: responseData.data as IPortofolio[], pagination: responseData.pagination };
  } catch (error: any) {
    console.error('Error fetching portofolio items:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil item portofolio.', data: null };
  }
}

/**
 * Mengambil satu item portofolio berdasarkan slug-nya (untuk halaman detail publik).
 * @param {string} slug - Slug dari item portofolio.
 * @returns {Promise<{status: string, message: string, data: IPortofolio | null}>}
 */
export async function fetchPortofolioItemBySlug(slug: string): Promise<{ status: string; message: string; data: IPortofolio | null }> {
  try {
    const res = await fetchWithToken(`/portofolio/slug/${slug}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Item portofolio berhasil diambil!', data: responseData.data as IPortofolio };
  } catch (error: any) {
    console.error('Error fetching portofolio item by slug:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil item portofolio berdasarkan slug.', data: null };
  }
}

/**
 * Mengambil satu item portofolio berdasarkan ID-nya (untuk formulir edit admin).
 * @param {string} id - ID dari item portofolio.
 * @returns {Promise<{status: string, message: string, data: IPortofolio | null}>}
 */
export async function fetchPortofolioItemById(id: string): Promise<{ status: string; message: string; data: IPortofolio | null }> {
  try {
    const res = await fetchWithToken(`/portofolio/${id}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Item portofolio berhasil diambil!', data: responseData.data as IPortofolio };
  } catch (error: any) {
    console.error('Error fetching portofolio item by ID:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil item portofolio berdasarkan ID.', data: null };
  }
}

/**
 * Membuat item portofolio baru di backend.
 * @param {IPortofolio} data - Data item portofolio.
 * @returns {Promise<{status: string, message: string, data: IPortofolio | null}>}
 */
export async function createPortofolioItem(data: IPortofolio): Promise<{ status: string; message: string; data: IPortofolio | null }> {
  try {
    const res = await fetchWithToken(`/portofolio/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Item portofolio berhasil dibuat!', data: responseData.data as IPortofolio };
  } catch (error: any) {
    console.error('Error creating portofolio item:', error);
    return { status: 'error', message: error.message || 'Gagal membuat item portofolio.', data: null };
  }
}

/**
 * Memperbarui item portofolio yang sudah ada di backend.
 * @param {string} id - ID dari item portofolio yang akan diperbarui.
 * @param {IPortofolio} data - Data item portofolio yang diperbarui.
 * @returns {Promise<{status: string, message: string, data: IPortofolio | null}>}
 */
export async function updatePortofolioItem(id: string, data: IPortofolio): Promise<{ status: string; message: string; data: IPortofolio | null }> {
  try {
    const res = await fetchWithToken(`/portofolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Item portofolio berhasil diperbarui!', data: responseData.data as IPortofolio };
  } catch (error: any) {
    console.error('Error updating portofolio item:', error);
    return { status: 'error', message: error.message || 'Gagal memperbarui item portofolio.', data: null };
  }
}

/**
 * Menghapus item portofolio dari backend.
 * @param {string} id - ID dari item portofolio yang akan dihapus.
 * @returns {Promise<{status: string, message: string}>}
 */
export async function deletePortofolioItem(id: string): Promise<{ status: string; message: string }> {
  try {
    const res = await fetchWithToken(`/portofolio/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Item portofolio berhasil dihapus!' };
  } catch (error: any) {
    console.error('Error deleting portofolio item:', error);
    return { status: 'error', message: error.message || 'Gagal menghapus item portofolio.' };
  }
}
