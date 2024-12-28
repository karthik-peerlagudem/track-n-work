import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
    // Redirect unauthenticated users to /sign-in for protected routes
    if (!isPublicRoute(request) && !(await auth()).userId) {
        console.log('Redirecting unauthenticated user to /sign-in');
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
