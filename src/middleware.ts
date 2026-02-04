import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { getClientIp, isSuspiciousRequest, matchesPath } from "@/lib/security/utils";

const SESSION_COOKIE_NAME = "ivlab_session";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

// API routes that need rate limiting
const AUTH_API_ROUTES = ["/api/auth/*"];
const CONTACT_API_ROUTES = ["/api/contact/*"];
const FEEDBACK_API_ROUTES = ["/api/feedback/*"];
const UPLOAD_API_ROUTES = ["/api/upload/*"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // Block suspicious requests
  if (isSuspiciousRequest(request)) {
    console.warn(`[Security] Blocked suspicious request from ${ip}: ${pathname}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    let rateLimitConfig = RATE_LIMITS.api;
    let rateLimitKey = `api:${ip}`;

    // Apply stricter limits for specific routes
    if (matchesPath(pathname, AUTH_API_ROUTES)) {
      rateLimitConfig = RATE_LIMITS.auth;
      rateLimitKey = `auth:${ip}`;
    } else if (matchesPath(pathname, CONTACT_API_ROUTES)) {
      rateLimitConfig = RATE_LIMITS.contact;
      rateLimitKey = `contact:${ip}`;
    } else if (matchesPath(pathname, FEEDBACK_API_ROUTES)) {
      rateLimitConfig = RATE_LIMITS.feedback;
      rateLimitKey = `feedback:${ip}`;
    } else if (matchesPath(pathname, UPLOAD_API_ROUTES)) {
      rateLimitConfig = RATE_LIMITS.upload;
      rateLimitKey = `upload:${ip}`;
    }

    const result = checkRateLimit(rateLimitKey, rateLimitConfig);

    if (!result.success) {
      console.warn(`[RateLimit] Rate limited ${ip} on ${pathname}`);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Too many requests. Please try again later."
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": result.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.reset.toString(),
            "Retry-After": Math.ceil((result.reset * 1000 - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", result.limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", result.reset.toString());
    return response;
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
