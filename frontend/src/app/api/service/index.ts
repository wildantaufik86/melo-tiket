// src/app/service.ts
// File ini akan menyimpan panggilan API frontend Anda untuk halaman Layanan.

import { IServicePage } from '@/types/service'; // Sesuaikan path ke types Anda

// Placeholder untuk fetchWithToken (gunakan yang sudah Anda definisikan secara global)
// Ini harus fetchWithToken yang sama yang Anda gunakan untuk data homepage.
export async function fetchWithToken(url: string, options?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('authToken'); // PENTING: Dapatkan token otentikasi Anda dari tempat penyimpanannya

  const headers = {
    ...options?.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Tambahkan token jika ada
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Mengambil konten halaman Layanan dari backend.
 * @returns {Promise<{status: string, message: string, data: IServicePage | null}>}
 */
export async function fetchServicePage(): Promise<{ status: string; message: string; data: IServicePage | null }> {
  try {
    const res = await fetchWithToken('/service/get', {
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
      message: responseData.message || 'Konten halaman layanan berhasil diambil!',
      data: responseData.data as IServicePage,
    };
  } catch (error: any) {
    console.error('Error saat mengambil halaman layanan:', error);
    return {
      status: 'error',
      message: error.message || 'Gagal mengambil konten halaman layanan.',
      data: null,
    };
  }
}

/**
 * Memperbarui konten halaman Layanan di backend.
 * @param {IServicePage} data - Data halaman Layanan untuk dikirim.
 * @returns {Promise<{status: string, message: string, data: IServicePage | null}>}
 */
export async function updateServicePage(data: IServicePage): Promise<{ status: string; message: string; data: IServicePage | null }> {
  try {
    const res = await fetchWithToken('/service/update', {
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
      message: responseData.message || 'Konten halaman layanan berhasil diperbarui!',
      data: responseData.data as IServicePage,
    };
  } catch (error: any) {
    console.error('Error saat memperbarui halaman layanan:', error);
    return {
      status: 'error',
      message: error.message || 'Gagal memperbarui konten halaman layanan.',
      data: null,
    };
  }
}

/**
 * Membuat konten halaman Layanan awal di backend.
 * Ini seharusnya hanya dipanggil sekali jika tidak ada data yang ada.
 * @param {IServicePage} data - Data halaman Layanan untuk dikirim.
 * @returns {Promise<{status: string, message: string, data: IServicePage | null}>}
 */
export async function createServicePage(data: IServicePage): Promise<{ status: string; message: string; data: IServicePage | null }> {
  try {
    const res = await fetchWithToken('/service/create', {
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
      message: responseData.message || 'Konten halaman layanan berhasil dibuat!',
      data: responseData.data as IServicePage,
    };
  } catch (error: any) {
    console.error('Error saat membuat halaman layanan:', error);
    return {
      status: 'error',
      message: error.message || 'Gagal membuat konten halaman layanan.',
      data: null,
    };
  }
}
