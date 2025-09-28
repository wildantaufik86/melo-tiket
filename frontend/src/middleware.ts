import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check for accessToken
  const hasToken = req.cookies.has('accessToken');

  // If no accessToken, redirect to login for protected paths
  if (!hasToken && !pathname.startsWith('/auth/login') && !pathname.startsWith('/api/auth')) {
    // We explicitly exclude /auth/login and /api/auth paths from redirection
    // to prevent infinite loops or issues with authentication API routes.
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // 2. Handle user role-based access for '/admin' paths
  if (pathname.startsWith('/admin')) {
    const userAuthCookie = req.cookies.get('user');
    let userData: { role?: string } | null = null;

    if (userAuthCookie) {
      try {
        userData = JSON.parse(userAuthCookie.value);
      } catch (error) {
        console.error('Error parsing userAuth cookie:', error);
        // Optionally, if the user cookie is corrupted, you might want to log out
        // or redirect to login to force re-authentication.
        // return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }

    const allowedRoles = ['superadmin', 'admin', 'operator']

    // If user data is not available or role is not 'admin', redirect away from admin paths
    if (!userData || !userData.role || !allowedRoles.includes(userData.role) ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 3. Allow the request to proceed for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/profile',
    // '/products/:path*', // Uncomment if you want to protect these paths
    // '/checkout/:path*', // Uncomment if you want to protect these paths
    '/admin/:path*',
    // Add other paths that require authentication/authorization here
  ],
};
