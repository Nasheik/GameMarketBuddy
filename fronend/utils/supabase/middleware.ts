import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
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
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user }, error } = await supabase.auth.getUser();

    // Define auth-related paths
    const authPaths = ['/sign-in', '/sign-up', '/forgot-password', '/auth/callback'];
    const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

    // If user is not authenticated and trying to access protected routes
    if (!user && !isAuthPath && (
      request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/create-game")
    )) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If user is authenticated and trying to access auth pages
    if (user && isAuthPath) {
      // Check if user has any games
      const { data: games } = await supabase
        .from('games')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (!games || games.length === 0) {
        return NextResponse.redirect(new URL("/create-game", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect authenticated users from root to appropriate page
    if (request.nextUrl.pathname === "/" && user) {
      // Check if user has any games
      const { data: games } = await supabase
        .from('games')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (!games || games.length === 0) {
        return NextResponse.redirect(new URL("/create-game", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    console.error('Middleware error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
