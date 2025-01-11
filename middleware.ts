import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
]);

// Add allowed origins
const allowedOrigins = [
    'https://krthk.me',
    'https://tracknwork.krthk.me',
    'http://localhost:3000',
];

export default clerkMiddleware(async (auth, request) => {
    const origin = request.headers.get('origin') || '';
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        const response = NextResponse.next();
        if (isAllowedOrigin) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set(
                'Access-Control-Allow-Methods',
                'GET,HEAD,PUT,PATCH,POST,DELETE'
            );
            response.headers.set(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization'
            );
            response.headers.set('Access-Control-Max-Age', '86400');
        }
        return response;
    }

    // Redirect unauthenticated users to /sign-in for protected routes
    if (!isPublicRoute(request) && !(await auth()).userId) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const response = NextResponse.next();
    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    return response;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
