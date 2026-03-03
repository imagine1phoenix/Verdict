import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const legacyAuth = request.cookies.get('verdict_auth');
    const nextAuthSession = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
    const isAuthenticated = legacyAuth || nextAuthSession;
    const isLoginPage = request.nextUrl.pathname === '/login';

    if (!isAuthenticated && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthenticated && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
