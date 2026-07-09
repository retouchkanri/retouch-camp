import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminLoginRoute = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin") && !isAdminLoginRoute;
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAccountPage = pathname.startsWith("/mypage");
  const isAccountApi = pathname.startsWith("/api/account");

  // Customer account routes: any logged-in user is fine.
  if ((isAccountPage || isAccountApi) && !user) {
    if (isAccountApi) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: need a session AND an admin/staff profile role — a logged-in
  // customer must not be able to reach these just by having a valid session.
  if (isAdminPage || isAdminApi) {
    if (!user) {
      if (isAdminApi) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const isStaff = profile?.role === "admin" || profile?.role === "staff";

    if (!isStaff) {
      if (isAdminApi) return NextResponse.json({ error: "権限がありません。" }, { status: 403 });
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAdminLoginRoute && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin" || profile?.role === "staff") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/mypage/:path*", "/api/account/:path*"],
};
