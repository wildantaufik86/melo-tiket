import { IEvent, ILineup } from '@/types/Event';
import { ITicket, TicketStatus } from '@/types/Ticket';

export interface ICreateEventPayload {
  eventName: string;
  date: string;
  time: string;
  address: string;
  description: string;
  eventDesc?: string;
  ticketDesc?: string;
  headlineImage?: string;
  lineup?: ILineup[];
  isPublished?: boolean;
}

export type IUpdateEventPayload = Partial<ICreateEventPayload>;

export interface ITicketPayload {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: TicketStatus;
  templateImage: string;
  templateLayout: string;
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
    cache: 'no-store',
  });
  return response;
}

export async function fetchAllEvents(): Promise<{
  status: string;
  message: string;
  data: IEvent[] | null;
}> {
  try {
    const res = await fetchWithToken(`/event`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `HTTP error! Status: ${res.status}`);
    }
    const responseData = await res.json();
    return {
      status: 'success',
      message: responseData.message || 'Event berhasil diambil!',
      data: responseData.events,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Gagal mengambil event.',
      data: null,
    };
  }
}

export async function fetchEventById(
  eventId: string
): Promise<{
  status: string;
  message: string;
  data: { event: IEvent; tickets: ITicket[] } | null;
}> {
  try {
    const res = await fetchWithToken(`/event/${eventId}`, { method: 'GET' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || `Event tidak ditemukan`);
    }
    const responseData = await res.json();
    return {
      status: 'success',
      message: 'Event dan tiket berhasil diambil!',
      data: responseData,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Gagal mengambil detail event.',
      data: null,
    };
  }
}

export async function createEvent(
  payload: ICreateEventPayload
): Promise<{ status: string; message: string; data: IEvent | null }> {
  try {
    const res = await fetchWithToken('/event/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || `Gagal membuat event`);
    return {
      status: 'success',
      message: responseData.message,
      data: responseData.event,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan saat membuat event.',
      data: null,
    };
  }
}

export async function updateEvent(
  eventId: string,
  payload: IUpdateEventPayload
): Promise<{ status: string; message: string; data: IEvent | null }> {
  try {
    const res = await fetchWithToken(`/event/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal memperbarui event');
    return {
      status: 'success',
      message: responseData.message,
      data: responseData.event,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan saat memperbarui event.',
      data: null,
    };
  }
}

export async function deleteEvent(
  eventId: string
): Promise<{ status: string; message: string }> {
  try {
    const res = await fetchWithToken(`/event/${eventId}`, { method: 'DELETE' });
    if (res.status === 204)
      return { status: 'success', message: 'Event berhasil dihapus!' };
    const errorBody = await res.json();
    throw new Error(errorBody.message || 'Gagal menghapus event.');
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan saat menghapus event.',
    };
  }
}

export async function addTicketTypeToEvent(
  eventId: string,
  payload: ITicketPayload
): Promise<{ status: string; message: string; data: IEvent | null }> {
  try {
    const res = await fetchWithToken(`/event/${eventId}/tickets`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal menambahkan tiket.');
    return {
      status: 'success',
      message: responseData.message,
      data: responseData.event,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan.',
      data: null,
    };
  }
}

export async function updateTicketType(
  eventId: string,
  ticketId: string,
  payload: Partial<ITicketPayload>
): Promise<{ status: string; message: string; data: ITicket | null }> {
  try {
    const res = await fetchWithToken(`/event/${eventId}/tickets/${ticketId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.message || 'Gagal memperbarui tiket.');
    return {
      status: 'success',
      message: responseData.message,
      data: responseData.ticket,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan.',
      data: null,
    };
  }
}
