import { ITicketTemplate } from "@/types/Template";

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

export async function fetchAllTemplates(): Promise<{ status: 'success' | 'error'; message: string; data: ITicketTemplate[] | null }> {
    try {
        const res = await fetchWithToken('/template', { method: 'GET' });
        const responseData = await res.json();
        if (!res.ok) throw new Error(responseData.message || 'Gagal mengambil data template.');

        return { status: 'success', message: 'Templates loaded successfully', data: responseData.data };
    } catch (error: any) {
        return { status: 'error', message: error.message, data: null };
    }
}

export async function fetchTemplateById(templateId: string): Promise<{ status: 'success' | 'error'; message: string; data: ITicketTemplate | null }> {
    try {
        const res = await fetchWithToken(`/template/${templateId}`, { method: 'GET' });
        const responseData = await res.json();
        if (!res.ok) throw new Error(responseData.message || 'Template tidak ditemukan.');

        return { status: 'success', message: 'Template loaded successfully', data: responseData.data };
    } catch (error: any) {
        return { status: 'error', message: error.message, data: null };
    }
}

export async function createTemplate(payload: FormData): Promise<{ status: 'success' | 'error'; message: string; data: ITicketTemplate | null }> {
    try {
        const res = await fetchWithToken('/template/create', {
            method: 'POST',
            body: payload,
        });
        const responseData = await res.json();
        if (!res.ok) throw new Error(responseData.message || 'Gagal membuat template.');

        return { status: 'success', message: 'Template created successfully', data: responseData.data };
    } catch (error: any) {
        return { status: 'error', message: error.message, data: null };
    }
}
