import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient as createServiceClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Create Supabase client with service role key
const supabaseService = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription & {
          start_date: number;
          current_period_end: number;
        };
        const customerId = subscription.customer as string;
        
        console.log('=== Webhook Debug Info ===');
        console.log('Event type:', event.type);
        console.log('Subscription ID:', subscription.id);
        console.log('Stripe Customer ID:', customerId);
        
        // Get user_id from public.users table
        const { data: user, error: userError } = await supabaseService
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
          
        console.log('User:', user);

        if (userError || !user) {
          console.error('Error finding user:', userError);
          return NextResponse.json(
            { error: "No user found for customer" },
            { status: 400 }
          );
        }
        
        // Create new subscription entry using service role client
        const { error: insertError } = await supabaseService
          .from('subscriptions')
          .insert({
            user_id: user.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan_id: subscription.id,
            current_period_end: new Date(Number(subscription.start_date) * 1000 + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
          
        if (insertError) {
          console.error('Error creating subscription:', insertError);
          return NextResponse.json(
            { error: "Failed to create subscription" },
            { status: 500 }
          );
        }
        
        console.log('Successfully created subscription for user:', user.id);
        return NextResponse.json({ success: true });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Update subscription status to cancelled using service role client
        const { error: updateError } = await supabaseService
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_customer_id", customerId);

        if (updateError) {
          console.error('Error updating subscription status:', updateError);
          return NextResponse.json(
            { error: "Failed to update subscription status" },
            { status: 500 }
          );
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
} 