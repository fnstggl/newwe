
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating to free plan");
      await supabaseClient.from("profiles").update({
        subscription_plan: 'free',
        subscription_renewal: 'monthly',
        stripe_customer_id: null
      }).eq('id', user.id);
      
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: 'free',
        subscription_renewal: 'monthly'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions including trials
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    let subscriptionTier = 'free';
    let subscriptionRenewal = 'monthly';
    let subscriptionEnd = null;
    let hasActiveSub = false;
    let isCanceled = false;

    // Find active or trialing subscriptions
    const validSubscriptions = subscriptions.data.filter(sub => 
      sub.status === 'active' || 
      sub.status === 'trialing' ||
      (sub.status === 'canceled' && sub.current_period_end * 1000 > Date.now())
    );

    if (validSubscriptions.length > 0) {
      const subscription = validSubscriptions[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Check if subscription is still valid (not expired)
      const isStillValid = subscription.current_period_end * 1000 > Date.now();
      
      if (isStillValid) {
        hasActiveSub = true;
        subscriptionTier = 'unlimited'; // Both monthly and annual get unlimited access
        isCanceled = subscription.status === 'canceled';
        
        // Determine renewal type from subscription interval
        const interval = subscription.items.data[0]?.price?.recurring?.interval;
        subscriptionRenewal = interval === 'year' ? 'annual' : 'monthly';
        
        logStep("Valid subscription found", { 
          subscriptionId: subscription.id, 
          status: subscription.status,
          endDate: subscriptionEnd,
          interval: interval,
          isStillValid,
          isCanceled,
          isTrialing: subscription.status === 'trialing'
        });
      } else {
        logStep("Subscription expired, reverting to free", { 
          subscriptionId: subscription.id, 
          endDate: subscriptionEnd 
        });
      }
    } else {
      logStep("No valid subscription found");
    }

    // Update profiles table
    const { error: updateError } = await supabaseClient.from("profiles").update({
      subscription_plan: subscriptionTier,
      subscription_renewal: subscriptionRenewal,
      stripe_customer_id: customerId
    }).eq('id', user.id);

    if (updateError) {
      logStep("Profile update error", { error: updateError });
    }

    logStep("Updated profile with subscription info", { 
      subscribed: hasActiveSub, 
      subscriptionTier,
      subscriptionRenewal,
      isCanceled
    });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_renewal: subscriptionRenewal,
      subscription_end: subscriptionEnd,
      is_canceled: isCanceled
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
