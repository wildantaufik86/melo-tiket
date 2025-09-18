import { IPost } from '@/types/post';
import { ICategory } from '@/types/category';

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

// --- API Functions for Categories ---

/**
 * Fetches all categories from the backend.
 * @returns {Promise<{status: string, message: string, data: ICategory[] | null}>}
 */
export async function fetchCategories(): Promise<{ status: string; message: string; data: ICategory[] | null }> {
  try {
    const res = await fetchWithToken('/categories/', { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Kategori berhasil diambil!', data: responseData.data as ICategory[] };
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil kategori.', data: null };
  }
}

/**
 * Creates a new category on the backend.
 * @param {ICategory} data - The category data.
 * @returns {Promise<{status: string, message: string, data: ICategory | null}>}
 */
export async function createCategory(data: ICategory): Promise<{ status: string; message: string; data: ICategory | null }> {
  try {
    const res = await fetchWithToken('/categories/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Kategori berhasil dibuat!', data: responseData.data as ICategory };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { status: 'error', message: error.message || 'Gagal membuat kategori.', data: null };
  }
}

/**
 * Updates an existing category on the backend.
 * @param {string} id - The ID of the category to update.
 * @param {ICategory} data - The updated category data.
 * @returns {Promise<{status: string, message: string, data: ICategory | null}>}
 */
export async function updateCategory(id: string, data: ICategory): Promise<{ status: string; message: string; data: ICategory | null }> {
  try {
    const res = await fetchWithToken(`/categories/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Kategori berhasil diperbarui!', data: responseData.data as ICategory };
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { status: 'error', message: error.message || 'Gagal memperbarui kategori.', data: null };
  }
}

/**
 * Deletes a category from the backend.
 * @param {string} id - The ID of the category to delete.
 * @returns {Promise<{status: string, message: string}>}
 */
export async function deleteCategory(id: string): Promise<{ status: string; message: string }> {
  try {
    const res = await fetchWithToken(`/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Kategori berhasil dihapus!' };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { status: 'error', message: error.message || 'Gagal menghapus kategori.' };
  }
}

// --- API Functions for Posts ---

/**
 * Fetches posts from the backend with pagination and optional category filter.
 * @param {object} params - Query parameters.
 * @param {number} [params.page=1] - The page number.
 * @param {number} [params.limit=10] - The number of posts per page.
 * @param {string} [params.categoryId] - Filter by category ID.
 * @returns {Promise<{status: string, message: string, data: IPost[] | null, pagination?: any}>}
 */
export async function fetchPosts({ page = 1, limit = 10, categoryId }: { page?: number; limit?: number; categoryId?: string } = {}): Promise<{ status: string; message: string; data: IPost[] | null; pagination?: any }> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (categoryId) {
      queryParams.append('categoryId', categoryId);
    }
    const res = await fetchWithToken(`/posts?${queryParams.toString()}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Post berhasil diambil!', data: responseData.data as IPost[], pagination: responseData.pagination };
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil post.', data: null };
  }
}

/**
 * Fetches a single post by its slug (for public detail page).
 * @param {string} slug - The slug of the post.
 * @returns {Promise<{status: string, message: string, data: IPost | null}>}
 */
export async function fetchPostBySlug(slug: string): Promise<{ status: string; message: string; data: IPost | null }> {
  try {
    const res = await fetchWithToken(`/posts/slug/${slug}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Post berhasil diambil!', data: responseData.data as IPost };
  } catch (error: any) {
    console.error('Error fetching post by slug:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil post berdasarkan slug.', data: null };
  }
}

/**
 * Fetches a single post by its ID (for admin edit form).
 * @param {string} id - The ID of the post.
 * @returns {Promise<{status: string, message: string, data: IPost | null}>}
 */
export async function fetchPostById(id: string): Promise<{ status: string; message: string; data: IPost | null }> {
  try {
    const res = await fetchWithToken(`/posts/${id}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Post berhasil diambil!', data: responseData.data as IPost };
  } catch (error: any) {
    console.error('Error fetching post by ID:', error);
    return { status: 'error', message: error.message || 'Gagal mengambil post berdasarkan ID.', data: null };
  }
}

/**
 * Creates a new post on the backend.
 * @param {IPost} data - The post data.
 * @returns {Promise<{status: string, message: string, data: IPost | null}>}
 */
export async function createPost(data: IPost): Promise<{ status: string; message: string; data: IPost | null }> {
  try {
    const res = await fetchWithToken('/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Post berhasil dibuat!', data: responseData.data as IPost };
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { status: 'error', message: error.message || 'Gagal membuat post.', data: null };
  }
}

/**
 * Updates an existing post on the backend.
 * @param {string} id - The ID of the post to update.
 * @param {IPost} data - The updated post data.
 * @returns {Promise<{status: string, message: string, data: IPost | null}>}
 */
export async function updatePost(id: string, data: IPost): Promise<{ status: string; message: string; data: IPost | null }> {
  try {
    const res = await fetchWithToken(`/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Post berhasil diperbarui!', data: responseData.data as IPost };
  } catch (error: any) {
    console.error('Error updating post:', error);
    return { status: 'error', message: error.message || 'Gagal memperbarui post.', data: null };
  }
}

/**
 * Deletes a post from the backend.
 * @param {string} id - The ID of the post to delete.
 * @returns {Promise<{status: string, message: string}>}
 */
export async function deletePost(id: string): Promise<{ status: string; message: string }> {
  try {
    const res = await fetchWithToken(`/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Post berhasil dihapus!' };
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return { status: 'error', message: error.message || 'Gagal menghapus post.' };
  }
}
