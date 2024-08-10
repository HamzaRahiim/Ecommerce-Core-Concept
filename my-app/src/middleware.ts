import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const token = request.cookies.get("access_token")?.value;
  // If the user is not authenticated, redirect to /auth/login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/order",
};
