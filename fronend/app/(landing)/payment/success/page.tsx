import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  
  // const { sessionId = await searchParams;
  // if (!sessionId) {
  //   return redirect("/payment");
  // }

  // Check if user has any games
  const { data: games } = await supabase
    .from('games')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  // Check subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  // If user has no games, redirect to create-game
  if (!games || games.length === 0) {
    return redirect("/create-game");
  }

  // If user has games, redirect to dashboard
  return redirect("/dashboard");
} 