import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  if (
    pathname !== "/" &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/static")
  ) {
    const params = new URLSearchParams(url.search);

    const newUrl = new URL("/", url.origin);

    if (params.has("id")) {
      newUrl.searchParams.set("id", params.get("id")!);
    }

    if (params.has("selectedAddress")) {
      newUrl.searchParams.set(
        "selectedAddress",
        params.get("selectedAddress")!
      );
    }

    return NextResponse.redirect(newUrl);
  }

  if (pathname === "/") {
    const params = new URLSearchParams(url.search);
    const hasInvalidParams = Array.from(params.keys()).some(
      (key) => key !== "id" && key !== "selectedAddress"
    );

    if (hasInvalidParams) {
      const newUrl = new URL("/", url.origin);

      if (params.has("id")) {
        newUrl.searchParams.set("id", params.get("id")!);
      }

      if (params.has("selectedAddress")) {
        newUrl.searchParams.set(
          "selectedAddress",
          params.get("selectedAddress")!
        );
      }

      return NextResponse.redirect(newUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*$).*)"],
};
