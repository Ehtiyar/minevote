import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // Check for admin session cookie (simple check without bcrypt)
  const adminSession = request.cookies.get('admin_session')?.value;

  if (!adminSession) {
    // Redirect to login page
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For now, just pass through - detailed verification will be done in API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
