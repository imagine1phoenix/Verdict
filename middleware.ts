import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register', '/signup', '/forgot-password']
const PUBLIC_PREFIXES = ['/_next', '/api', '/favicon.ico', '/images', '/fonts', '/public']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow public prefixes (static files, auth API, etc.)
    if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
        return NextResponse.next()
    }

    // Check for both the classic cookie and the NextAuth session cookie
    const legacyAuth = request.cookies.get('verdict_auth')?.value
    const nextAuthSession = request.cookies.get('next-auth.session-token')?.value || request.cookies.get('__Secure-next-auth.session-token')?.value

    const isAuthenticated = !!(legacyAuth || nextAuthSession)
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route)

    // If user is NOT authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If user IS authenticated and trying to access login page
    if (isAuthenticated && isPublicRoute) {
        // In Verdict, the main dashboard is at `/`
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
