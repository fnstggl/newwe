
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    logStep("Webhook event received", { type: event.type, id: event.id });

    // Handle payment intent succeeded for subscription activation
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      logStep("Payment intent succeeded", { paymentIntentId: paymentIntent.id });

      // Find the subscription associated with this payment intent
      const invoices = await stripe.invoices.list({
        customer: paymentIntent.customer as string,
        limit: 10,
      });

      let subscriptionId = null;
      for (const invoice of invoices.data) {
        if (invoice.payment_intent === paymentIntent.id) {
          subscriptionId = invoice.subscription;
          break;
        }
      }

      if (subscriptionId) {
        logStep("Found subscription for payment intent", { subscriptionId });
        
        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
        const interval = subscription.items.data[0]?.price?.recurring?.interval;
        const billingCycle = interval === 'year' ? 'annual' : 'monthly';

        // Find user by customer ID
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', paymentIntent.customer)
          .single();

        if (profileError || !profileData) {
          logStep("Could not find user profile", { customerId: paymentIntent.customer, error: profileError });
          return new Response("User not found", { status: 404 });
        }

        // Update user profile with subscription details - Both monthly and annual get unlimited
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ 
            subscription_plan: 'unlimited',
            subscription_renewal: billingCycle
          })
          .eq('id', profileData.id);

        if (updateError) {
          logStep("Profile update error", { error: updateError });
        } else {
          logStep("Profile updated successfully", { userId: profileData.id, billingCycle });
        }

        // Update subscribers table
        const subscriptionEndDate = new Date(subscription.current_period_end * 1000);
        const { error: subscriberError } = await supabaseClient
          .from('subscribers')
          .upsert({
            user_id: profileData.id,
            stripe_customer_id: paymentIntent.customer as string,
            subscribed: true,
            subscription_tier: 'unlimited',
            subscription_end: subscriptionEndDate.toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        if (subscriberError) {
          logStep("Subscriber update error", { error: subscriberError });
        } else {
          logStep("Subscriber record updated successfully");
        }
      }
    }

    // Handle subscription creation (for trials)
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object;
      logStep("Subscription created", { subscriptionId: subscription.id, status: subscription.status });

      // For trialing subscriptions, immediately upgrade user to unlimited
      if (subscription.status === 'trialing') {
        const interval = subscription.items.data[0]?.price?.recurring?.interval;
        const billingCycle = interval === 'year' ? 'annual' : 'monthly';

        // Find user by customer ID
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (profileData && !profileError) {
          // Update user profile for trial users
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ 
              subscription_plan: 'unlimited',
              subscription_renewal: billingCycle
            })
            .eq('id', profileData.id);

          if (updateError) {
            logStep("Trial profile update error", { error: updateError });
          } else {
            logStep("Trial profile updated successfully", { userId: profileData.id, billingCycle });
          }

          // Update subscribers table for trial
          const subscriptionEndDate = new Date(subscription.current_period_end * 1000);
          const { error: subscriberError } = await supabaseClient
            .from('subscribers')
            .upsert({
              user_id: profileData.id,
              stripe_customer_id: subscription.customer as string,
              subscribed: true,
              subscription_tier: 'unlimited',
              subscription_end: subscriptionEndDate.toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

          if (subscriberError) {
            logStep("Trial subscriber update error", { error: subscriberError });
          } else {
            logStep("Trial subscriber record updated successfully");
          }
        }
      }
    }

    // Handle subscription cancellation
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      if (subscription.cancel_at_period_end) {
        logStep("Subscription marked for cancellation", { subscriptionId: subscription.id });
        
        // Find user by customer ID
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (profileData && !profileError) {
          // Update subscribers table to reflect cancellation
          const { error: subscriberError } = await supabaseClient
            .from('subscribers')
            .update({
              subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', profileData.id);

          if (subscriberError) {
            logStep("Subscriber cancellation update error", { error: subscriberError });
          } else {
            logStep("Subscriber cancellation recorded successfully");
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
