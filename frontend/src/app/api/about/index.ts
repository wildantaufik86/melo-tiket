// src/app/about/get.ts
// This file will hold your frontend API calls for the About page.

import { IAbout } from "@/types/about";

// Placeholder for fetchWithToken (if you have one globally defined, use that)
// This should be the same fetchWithToken you used for homepage data.
export async function fetchWithToken(url: string, options?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('authToken'); // IMPORTANT: Get your auth token from where it's stored

  const headers = {
    ...options?.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Add token if it exists
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Fetches the About page content from the backend.
 * @returns {Promise<{status: string, message: string, data: IAbout | null}>}
 */
export async function fetchAboutPage(): Promise<{ status: string; message: string; data: IAbout | null }> {
  try {
    const res = await fetchWithToken('/about/get', {
      method: 'GET',
    });

    if (!res.ok) {
      let errorMessage = `HTTP error! Status: ${res.status}`;
      try {
        const errorBody = await res.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        errorMessage = res.statusText || 'Server responded with an error, but not JSON.';
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'About page content fetched successfully!',
      data: responseData.data as IAbout,
    };
  } catch (error: any) {
    console.error('Error fetching about page:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to fetch about page content.',
      data: null,
    };
  }
}

/**
 * Updates the About page content on the backend.
 * @param {IAbout} data - The About page data to send.
 * @returns {Promise<{status: string, message: string, data: IAbout | null}>}
 */
export async function updateAboutPage(data: IAbout): Promise<{ status: string; message: string; data: IAbout | null }> {
  try {
    const res = await fetchWithToken('/about/update', {
      method: 'PUT', // Use PUT for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = `HTTP error! Status: ${res.status}`;
      try {
        const errorBody = await res.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        errorMessage = res.statusText || 'Server responded with an error, but not JSON.';
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'About page content updated successfully!',
      data: responseData.data as IAbout,
    };
  } catch (error: any) {
    console.error('Error updating about page:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to update about page content.',
      data: null,
    };
  }
}

/**
 * Creates the initial About page content on the backend.
 * This should ideally only be called once if no data exists.
 * @param {IAbout} data - The About page data to send.
 * @returns {Promise<{status: string, message: string, data: IAbout | null}>}
 */
export async function createAboutPage(data: IAbout): Promise<{ status: string; message: string; data: IAbout | null }> {
  try {
    const res = await fetchWithToken('/about/create', {
      method: 'POST', // Use POST for creating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = `HTTP error! Status: ${res.status}`;
      try {
        const errorBody = await res.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (jsonError) {
        errorMessage = res.statusText || 'Server responded with an error, but not JSON.';
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'About page content created successfully!',
      data: responseData.data as IAbout,
    };
  } catch (error: any) {
    console.error('Error creating about page:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to create about page content.',
      data: null,
    };
  }
}

// Note: You might also want a deleteAboutPage function if needed.
