// @/lib/clientUtils.ts
// This file does NOT need a 'use client' directive at the top,
// but the components that import and use these functions MUST be client components.

/**
 * Sets a cookie on the client-side using `document.cookie`.
 * Values are automatically JSON.stringify-ed.
 * @param name The name of the cookie.
 * @param value The value to store (will be JSON.stringify-ed).
 * @param options Cookie options (maxAge, path, secure, etc.).
 */
 export const setCookie = (
  name: string,
  value: unknown,
  options?: {
    expires?: Date;
    maxAge?: number; // In seconds
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean; // Note: Cannot be directly set by client-side JS for httpOnly cookies.
    sameSite?: 'strict' | 'lax' | 'none';
  }
): void => {
  if (typeof document === 'undefined') return; // Only run in browser environment

  // It's a good practice to encode the value when setting the cookie,
  // especially if it's JSON that might contain special characters.
  let cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))}`;

  if (options) {
    if (options.maxAge !== undefined) {
      cookieString += `; Max-Age=${options.maxAge}`;
    } else if (options.expires) {
      cookieString += `; Expires=${options.expires.toUTCString()}`;
    }
    if (options.path) {
      cookieString += `; Path=${options.path}`;
    }
    if (options.domain) {
      cookieString += `; Domain=${options.domain}`;
    }
    if (options.secure) {
      cookieString += `; Secure`;
    }
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }
  }

  document.cookie = cookieString;
};

/**
 * Retrieves a cookie value from the client-side using `document.cookie`.
 * Values are automatically JSON.parse-d.
 * @param name The name of the cookie.
 * @returns The parsed cookie value or null if not found/parse error.
 */
export const getCookie = <T = unknown>(name: string): T | null => {
  if (typeof document === 'undefined') return null; // Only run in browser environment

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        const encodedValue = c.substring(nameEQ.length, c.length);
        const decodedValue = decodeURIComponent(encodedValue); // <--- ADD THIS LINE!
        return JSON.parse(decodedValue) as T; // Parse the decoded value
      } catch (error) {
        console.error(`Error parsing client cookie '${name}':`, error);
        return null;
      }
    }
  }
  return null;
};

/**
 * Deletes a cookie on the client-side.
 * @param name The name of the cookie to delete.
 * @param path The path of the cookie (defaults to '/').
 */
export const deleteCookie = (name: string, path: string = '/'): void => {
  if (typeof document === 'undefined') return; // Only run in browser environment
  document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

/**
 * Sets an item in localStorage.
 * @param key The key under which to store the value.
 * @param value The value to store (will be JSON.stringify-ed).
 */
export const setLocalStorage = (key: string, value: unknown): void => {
  try {
    if (typeof localStorage === 'undefined') return; // Only run in browser environment
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Retrieves an item from localStorage.
 * @param key The key of the item to retrieve.
 * @returns The parsed value or null if not found/parse error.
 */
export const getLocalStorage = <T = unknown>(key: string): T | null => {
  try {
    if (typeof localStorage === 'undefined') return null; // Only run in browser environment
    const data = localStorage.getItem(key);
    const parsedData = data ? (JSON.parse(data) as T) : null;
    return parsedData;
  } catch (error) {
    console.error('Failed to retrieve data from localStorage:', error);
    return null;
  }
};

/**
 * Deletes an item from localStorage.
 * @param key The key of the item to delete.
 */
export const deleteLocalStorage = (key: string): void => {
  try {
    if (typeof localStorage === 'undefined') return; // Only run in browser environment
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to delete from localStorage:', error);
  }
};

/**
 * Retrieves cart data from client-side cookies.
 * @returns The cart data or null.
 */
export const getDataCart = () => {
  // Assuming 'cartList' is stored in cookies that client-side JS can access.
  // If 'cartList' should be httpOnly, you'd need a server action to get it.
  const data = getCookie('cartList'); // Now uses client-side getCookie
  return data;
};
