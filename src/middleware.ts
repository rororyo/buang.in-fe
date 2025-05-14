import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const tokenInCookie = request.cookies.get('token')?.value;

  const protectedPaths = ['/dashboard', '/profile', '/penukaran', '/riwayat'];
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !tokenInCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*', '/penukaran/:path*', '/riwayat/:path*'],
// };
