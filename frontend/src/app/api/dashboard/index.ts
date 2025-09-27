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

export async function fetchDashboardSummary() {
  try {
    const res = await fetchWithToken(`/dashboard/summary`, { method: "GET" });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || "Gagal mengambil summary");
    return { status: "success", data: responseData.data };
  } catch (error: any) {
    return { status: "error", data: null, message: error.message };
  }
}
