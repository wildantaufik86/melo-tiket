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

export async function getMyProfile() {
  try {
    const res = await fetchWithToken("/profile", {
      method: "GET",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function updateMyProfile(idNumber: number) {
  try {
    const res = await fetchWithToken("/profile/update", {
      method: "PATCH",
      body: JSON.stringify({ idNumber }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function forgotPassword({
  email,
  idNumber,
  newPassword,
  newPasswordConfirmation,
}: {
  email: string;
  idNumber?: number;
  newPassword: string;
  newPasswordConfirmation: string;
}) {
  try {
    const res = await fetchWithToken("/profile/forgot-password", {
      method: "PATCH",
      body: JSON.stringify({
        email,
        idNumber,
        newPassword,
        newPasswordConfirmation,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to reset password");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}
