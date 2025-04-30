"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get the user's stripe_customer_id from the database
  const { data: userData } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!userData?.stripe_customer_id) {
    throw new Error("No Stripe customer ID found for user");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: userData.stripe_customer_id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment`,
      metadata: {
        userId: user.id,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return { url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

export async function validatePromoCode(formData: FormData) {
  const promoCode = formData.get("promoCode")?.toString();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (promoCode?.toLowerCase() === "test") {
    // Create a subscription for the user
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        status: 'active',
        stripe_customer_id: 'Test',
        stripe_subscription_id: 'Test',
        // status: 'active',
        plan_id: 'Test',
        // current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    console.log("Subscription added successfully");
    if (error) {
      console.error("Error creating subscription:", error);
      return redirect("/payment?error=Failed to create subscription");
    }

    console.log("Subscription created successfully");

    // Check if user has any games
    const { data: games } = await supabase
      .from('games')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    // If user has no games, redirect to create-game
    if (!games || games.length === 0) {
      return redirect("/create-game");
    }

    // If user has games, redirect to dashboard
    return redirect("/dashboard");
  }

  return redirect("/payment?error=Invalid promo code");
} 