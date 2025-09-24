import { IEvent } from "@/types/Event";
import { ITicket } from "@/types/Ticket";

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

export async function fetchAllTicket(eventId: string): Promise<{ status: string; message: string; data: ITicket[] | null }> {
  try {
    const res = await fetchWithToken(`/ticket/${eventId}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return { status: 'success', message: responseData.message || 'Event berhasil diambil!', data: responseData.tickets };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Gagal mengambil event.', data: null };
  }
}

export async function fetchTicketById(eventId: string, ticketId: string): Promise<{ status: string; message: string; data: { event: IEvent, tickets: ITicket[] } | null }> {
  try {
    const res = await fetchWithToken(`/ticket/${eventId}/${ticketId}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Ticket tidak ditemukan`);
    }
    const responseData = await res.json();
    return { status: 'success', message: 'Ticket dan tiket berhasil diambil!', data: responseData };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Gagal mengambil detail ticket.', data: null };
  }
}
