import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AdminAuth } from './lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for admin session
  const admin = await AdminAuth.getAdminFromRequest(request);

  if (!admin) {
    // Redirect to login page
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add admin info to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-admin-id', admin.id);
  requestHeaders.set('x-admin-username', admin.username);
  requestHeaders.set('x-admin-role', admin.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
