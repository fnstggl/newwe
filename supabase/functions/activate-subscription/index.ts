
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ACTIVATE-SUBSCRIPTION] ${step}${detailsStr}`);
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
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { payment_intent_id, billing_cycle } = await req.json();
    if (!payment_intent_id) {
      throw new Error("Missing payment_intent_id");
    }
    logStep("Request data validated", { payment_intent_id, billing_cycle });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Verify payment intent is succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    if (paymentIntent.status !== 'succeeded') {
      throw new Error(`Payment intent status is ${paymentIntent.status}, expected succeeded`);
    }
    logStep("Payment intent verified as succeeded", { paymentIntentId: payment_intent_id });

    // Find the subscription associated with this payment intent
    const invoices = await stripe.invoices.list({
      customer: paymentIntent.customer as string,
      limit: 10,
    });

    let subscriptionId = null;
    for (const invoice of invoices.data) {
      if (invoice.payment_intent === payment_intent_id) {
        subscriptionId = invoice.subscription;
        break;
      }
    }

    if (!subscriptionId) {
      throw new Error("Could not find subscription for this payment intent");
    }
    logStep("Found subscription", { subscriptionId });

    // Update user profile with subscription details
    const subscriptionEndDate = new Date();
    if (billing_cycle === 'annual') {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    } else {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    }

    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ 
        subscription_plan: 'unlimited',
        subscription_renewal: billing_cycle || 'monthly'
      })
      .eq('id', user.id);

    if (profileError) {
      logStep("Profile update error", { error: profileError });
      throw new Error(`Failed to update user profile: ${profileError.message}`);
    }
    logStep("Profile updated successfully with subscription plan");

    // Update subscribers table
    const { error: subscriberError } = await supabaseClient
      .from('subscribers')
      .upsert({
        user_id: user.id,
        email: user.email,
        stripe_customer_id: paymentIntent.customer as string,
        subscribed: true,
        subscription_tier: 'unlimited',
        subscription_end: subscriptionEndDate.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

    if (subscriberError) {
      logStep("Subscriber update error", { error: subscriberError });
    } else {
      logStep("Subscriber record updated successfully");
    }

    return new Response(JSON.stringify({ 
      success: true,
      subscription_id: subscriptionId,
      subscription_plan: 'unlimited'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in activate-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
