import { authMiddleware } from "@clerk/nextjs"

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/dashboard/bidder/bids",
    "/dashboard/bidder",
    "/api/login",
    "/api/register/user",
  ],
  ignoredRoutes: ["/api/login"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
