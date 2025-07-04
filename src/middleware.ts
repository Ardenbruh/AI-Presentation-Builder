import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/editor(.*)',
  '/api/presentations(.*)',
  '/api/slides(.*)',
  '/api/ai(.*)'
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/present(.*)',
  '/api/ai-status',
  '/api/health'
])

export default clerkMiddleware(async (auth, req) => {
  // Development mode bypass for testing
  const isDevelopment = process.env.NODE_ENV === 'development' && 
    (process.env.CLERK_SECRET_KEY?.includes('test') || process.env.CLERK_SECRET_KEY?.includes('development'))
  
  if (!isPublicRoute(req) && isProtectedRoute(req) && !isDevelopment) {
    await auth().protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
