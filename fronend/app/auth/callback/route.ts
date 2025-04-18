import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Check if user has any games
      const { data: games } = await supabase
        .from('games')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      if (!games || games.length === 0) {
        return NextResponse.redirect(`${origin}/create-game`);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // Fallback to sign-in page if something goes wrong
  return NextResponse.redirect(`${origin}/sign-in`);
}
