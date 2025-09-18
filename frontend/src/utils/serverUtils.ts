// @/lib/serverUtils.ts
import { cookies } from 'next/headers';
import type { Schema } from 'joi'; // Type import for Joi Schemat CookieOptions for stronger typing

interface CustomCookieOptions {
  expires?: Date;
  maxAge?: number; // In seconds
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  priority?: 'low' | 'medium' | 'high';
  encode?: (val: string) => string;
  partitioned?: boolean;
}

export const serverSetCookie = async ( // <--- ADD 'async' here
  name: string,
  value: unknown,
  options?: CustomCookieOptions // <--- Use CookieOptions from next/headers for precise typing
): Promise<void> => {
  const jsonValue = JSON.stringify(value);
  (await cookies()).set(name, jsonValue, options);
};

/**
 * Retrieves a cookie value from the server-side using Next.js cookies() API.
 * Values are automatically JSON.parse-d.
 * @param name The name of the cookie.
 * @returns The parsed cookie value or null if not found/parse error.
 */
export const serverGetCookie = async <T = unknown>(name: string): Promise<T | null> => { // <--- ADD 'async' here, and make return type Promise<T | null>
  const cookieStore = await cookies(); // <--- ADD 'await' here
  const data = cookieStore.get(name);
  if (data && data.value) {
    try {
      return JSON.parse(data.value) as T;
    } catch (error) {
      console.error(`Error parsing server cookie '${name}':`, error);
      return null;
    }
  }
  return null;
};

/**
 * Deletes a cookie on the server-side using Next.js cookies() API.
 * @param name The name of the cookie to delete.
 */
export const serverDeleteCookie = async (name: string): Promise<void> => { // <--- ADD 'async' here
  (await cookies()).delete(name);
};

// You can move `validateInput` here if it's primarily used in Server Actions,
// or keep it in universalUtils if it's broadly used. For now, it's universal.
// If you do move it here, remember to import Joi directly if Schema is not enough.
// For example:
// import Joi from 'joi';
// export const validateInput = (schema: Joi.Schema, input: unknown) => { /* ... */ };
