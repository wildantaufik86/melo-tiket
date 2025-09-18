// src/app/api/homepage.ts

import { IHomepageContent } from '@/types/homepage'; // Memastikan impor tipe yang benar

// Fungsi bantu untuk melakukan permintaan HTTP dengan token otentikasi
export async function fetchWithToken(url: string, options?: RequestInit): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    ...(options?.headers || {}),
  };

  // IMPORTANT: Only set 'Content-Type: application/json' if the body is not FormData
  if (!(options?.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  // ELSE: if it IS FormData, DO NOT set Content-Type. The browser handles it.

  console.log('Fetching URL:', `${baseUrl}${url}`); // Add this for debug
  console.log('Fetch Headers:', headers); // Add this for debug
  console.log('Fetch Body type:', options?.body instanceof FormData ? 'FormData' : typeof options?.body); // Add this for debug

  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  return response;
}

export type HomepageSection = keyof IHomepageContent;

export async function fetchHomepageContent(section?: HomepageSection): Promise<{ status: string; message: string; data: IHomepageContent | null }> {
  try {
    let url = '/homepages/get';
    if (section) {
      url += `?section=${section}`
    }

    const res = await fetchWithToken('/homepages/get', { method: 'GET' }); // Endpoint: /api/homepage
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    const dataToReturn = section ? responseData.data[section] : responseData.data;
    return { status: 'success', message: responseData.message || 'Konten halaman utama berhasil diambil!', data: dataToReturn as IHomepageContent };
  } catch (error: any) {
    console.error('Error fetching homepage content:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil konten homepage.', data: null };
  }
}

export const updateHomepageContent = async (formData: FormData) => {
  try {
    const res = await fetchWithToken('/homepages/update', {
      method: 'PUT',
      body: formData
    });

    if (!res.ok) {
      const rawText = await res.text(); // baca hanya sekali
      let errorMessage = `Error HTTP! Status: ${res.status}`;

      try {
        const errorBody = JSON.parse(rawText);
        errorMessage = errorBody.message || errorMessage;
      } catch (_) {
        if (rawText) errorMessage = rawText;
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'Konten halaman utama berhasil diperbarui!',
      data: responseData.data as IHomepageContent
    };
  } catch (error: any) {
    console.error('Error updating homepage content:', error);
    return {
      status: 'error',
      message: error.message || 'Gagal memperbarui konten homepage.',
      data: null
    };
  }
};


/**
 * Membuat konten halaman utama baru di backend.
 */
 export const createHomepageContent = async (formData: FormData) => {
  try {
    const res = await fetchWithToken('/homepages/create', { // Endpoint: /api/homepage
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Error HTTP! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Konten halaman utama berhasil dibuat!', data: responseData.data as IHomepageContent };
  } catch (error: any) {
    console.error('Error creating homepage content:', error);
    return { status: 'error', message: error.message || 'Gagal membuat konten homepage.', data: null };
  }
}
