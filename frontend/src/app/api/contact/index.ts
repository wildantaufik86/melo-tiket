import { IContact } from '@/types/contact'; // Sesuaikan path ke types Anda

export async function fetchWithToken(url: string, options?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('authToken');

  const headers = {
    ...options?.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Mengambil konten halaman Kontak dari backend.
 * @returns {Promise<{status: string, message: string, data: IContact | null}>}
 */
export async function fetchContactPage(): Promise<{ status: string; message: string; data: IContact | null }> {
  try {
    const res = await fetchWithToken('/contact/get', {
      method: 'GET',
    });

    if (!res.ok) {
      let errorMessage = `Error HTTP! Status: ${res.status}`;
      try {
        const errorBody = await res.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        errorMessage = res.statusText || 'Server merespons dengan error, tapi bukan JSON.';
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'Konten halaman kontak berhasil diambil!',
      data: responseData.data as IContact,
    };
  } catch (error: any) {
    console.error('Error saat mengambil halaman kontak:', error);
    return {
      status: 'error',
      message: error.message || 'Gagal mengambil konten halaman kontak.',
      data: null,
    };
  }
}

/**
 * Memperbarui konten halaman Kontak di backend.
 * @param {IContact} data - Data halaman Kontak untuk dikirim.
 * @returns {Promise<{status: string, message: string, data: IContact | null}>}
 */
export async function updateContactPage(data: IContact): Promise<{ status: string; message: string; data: IContact | null }> {
  try {
    const res = await fetchWithToken('/contact/update', {
      method: 'PUT', // Gunakan PUT untuk memperbarui
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = `Error HTTP! Status: ${res.status}`;
      try {
        const errorBody = await res.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        errorMessage = res.statusText || 'Server merespons dengan error, tapi bukan JSON.';
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'Konten halaman kontak berhasil diperbarui!',
      data: responseData.data as IContact,
    };
  } catch (error: any) {
    console.error('Error saat memperbarui halaman kontak:', error);
    return {
      status: 'error',
      message: error.message || 'Gagal memperbarui konten halaman kontak.',
      data: null,
    };
  }
}

/**
 * Membuat konten halaman Kontak awal di backend.
 * Ini seharusnya hanya dipanggil sekali jika tidak ada data yang ada.
 * @param {IContact} data - Data halaman Kontak untuk dikirim.
 * @returns {Promise<{status: string, message: string, data: IContact | null}>}
 */
export async function createContactPage(data: IContact): Promise<{ status: string; message: string; data: IContact | null }> {
  try {
    const res = await fetchWithToken('/contact/create', {
      method: 'POST', // Gunakan POST untuk membuat
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = `Error HTTP! Status: ${res.status}`;
      try {
        const errorBody = await res.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        errorMessage = res.statusText || 'Server merespons dengan error, tapi bukan JSON.';
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'Konten halaman kontak berhasil dibuat!',
      data: responseData.data as IContact,
    };
  } catch (error: any) {
    console.error('Error saat membuat halaman kontak:', error);
    return {
      status: 'error',
      message: error.message || 'Gagal membuat konten halaman kontak.',
      data: null,
    };
  }
}
