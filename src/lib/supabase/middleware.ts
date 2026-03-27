import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicAdminPath = request.nextUrl.pathname === '/admin/signup';

  if (user) {
    // Fetch user record for role and active status
    const { data: userRecord } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    const role = userRecord?.role || 'player';
    const isActive = userRecord?.is_active ?? true;

    // 1. Block inactive users from all protected routes
    // Exception: /admin/signup must be accessible to complete registration
    if (!isActive && !isPublicAdminPath && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/dashboard'))) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'Your account is inactive.');
        return NextResponse.redirect(url);
    }
  } else {
    // Protect /admin and /dashboard if not logged in
    // Exception: /admin/signup is used by invited users to register
    if (!isPublicAdminPath && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/dashboard'))) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
