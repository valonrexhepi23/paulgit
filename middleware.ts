import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


const isOnboardingRoute = createRouteMatcher(['/onboarding'])


const isProtectedRoute = createRouteMatcher([
    '/readme(.*)',
    '/api(.*)', // Protect all API routes
])

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    if (userId && isOnboardingRoute(req)) {
        return NextResponse.next();
    }

    if (!userId && isProtectedRoute(req)) return redirectToSignIn({ returnBackUrl: req.url })

    if (isProtectedRoute(req)) await auth.protect();
    if (req.nextUrl.pathname === '/' && userId) {
        const url = req.nextUrl.clone();
        url.pathname = '/readme';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}