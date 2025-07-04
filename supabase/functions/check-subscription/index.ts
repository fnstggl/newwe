
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
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // STEP 1: Get current subscription state from profiles table FIRST
    const { data: currentProfile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("subscription_plan, subscription_renewal, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
      logStep("Error fetching current profile", { error: profileError });
    }

    const currentSubscriptionPlan = currentProfile?.subscription_plan || 'free';
    const currentSubscriptionRenewal = currentProfile?.subscription_renewal || 'monthly';
    const currentStripeCustomerId = currentProfile?.stripe_customer_id;

    logStep("Current profile state", { 
      currentSubscriptionPlan, 
      currentSubscriptionRenewal, 
      currentStripeCustomerId 
    });

    // STEP 2: Try to fetch from Stripe - but be conservative with failures
    let stripe;
    let customers;
    let stripeError = null;

    try {
      stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
      logStep("Stripe customer lookup successful", { customerCount: customers.data.length });
    } catch (error) {
      stripeError = error;
      logStep("Stripe customer lookup failed", { error: error.message });
    }

    // STEP 3: Handle Stripe lookup failure conservatively
    if (stripeError || !customers) {
      logStep("Stripe API unavailable - preserving current subscription state", {
        currentPlan: currentSubscriptionPlan,
        error: stripeError?.message
      });
      
      // Return current state without changes - DO NOT downgrade due to API failures
      return new Response(JSON.stringify({ 
        subscribed: currentSubscriptionPlan !== 'free', 
        subscription_tier: currentSubscriptionPlan,
        subscription_renewal: currentSubscriptionRenewal,
        source: 'preserved_due_to_stripe_error'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // STEP 4: Handle no Stripe customer found - but be conservative
    if (customers.data.length === 0) {
      logStep("No Stripe customer found", { 
        currentPlan: currentSubscriptionPlan,
        willPreserveUnlessAlreadyFree: true
      });
      
      // CONSERVATIVE APPROACH: Only set to free if user was already free
      // If user has unlimited plan but no Stripe customer, preserve their plan
      // This could happen due to Stripe data sync issues, not necessarily cancellation
      if (currentSubscriptionPlan === 'free') {
        logStep("User already on free plan, confirming free status");
        await supabaseClient.from("profiles").update({
          subscription_plan: 'free',
          subscription_renewal: 'monthly',
          stripe_customer_id: null
        }).eq('id', user.id);
      } else {
        logStep("User has paid plan but no Stripe customer - preserving current plan", {
          preservedPlan: currentSubscriptionPlan
        });
      }
      
      return new Response(JSON.stringify({ 
        subscribed: currentSubscriptionPlan !== 'free', 
        subscription_tier: currentSubscriptionPlan,
        subscription_renewal: currentSubscriptionRenewal,
        source: currentSubscriptionPlan === 'free' ? 'confirmed_free' : 'preserved_paid_plan'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // STEP 5: We have a Stripe customer - check their subscription status
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    let subscriptions;
    let subscriptionError = null;

    try {
      subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      logStep("Stripe subscription lookup successful", { activeSubscriptions: subscriptions.data.length });
    } catch (error) {
      subscriptionError = error;
      logStep("Stripe subscription lookup failed", { error: error.message });
    }

    // STEP 6: Handle subscription lookup failure conservatively
    if (subscriptionError || !subscriptions) {
      logStep("Stripe subscription API unavailable - preserving current state", {
        currentPlan: currentSubscriptionPlan,
        error: subscriptionError?.message
      });
      
      // Update stripe_customer_id but preserve subscription status
      await supabaseClient.from("profiles").update({
        stripe_customer_id: customerId
      }).eq('id', user.id);
      
      return new Response(JSON.stringify({ 
        subscribed: currentSubscriptionPlan !== 'free', 
        subscription_tier: currentSubscriptionPlan,
        subscription_renewal: currentSubscriptionRenewal,
        source: 'preserved_due_to_subscription_api_error'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // STEP 7: We have definitive Stripe data - update accordingly
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = 'free';
    let subscriptionRenewal = 'monthly';
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      subscriptionTier = 'unlimited';
      
      // Determine renewal type from subscription interval
      const interval = subscription.items.data[0]?.price?.recurring?.interval;
      subscriptionRenewal = interval === 'year' ? 'annual' : 'monthly';
      
      logStep("Active subscription confirmed", { 
        subscriptionId: subscription.id, 
        endDate: subscriptionEnd,
        interval: interval,
        beforeState: currentSubscriptionPlan,
        afterState: subscriptionTier
      });
    } else {
      logStep("No active subscription found - definitive downgrade", {
        beforeState: currentSubscriptionPlan,
        afterState: 'free',
        reason: 'confirmed_no_active_stripe_subscription'
      });
    }

    // STEP 8: Update profiles table with definitive Stripe data
    const { error: updateError } = await supabaseClient.from("profiles").update({
      subscription_plan: subscriptionTier,
      subscription_renewal: subscriptionRenewal,
      stripe_customer_id: customerId
    }).eq('id', user.id);

    if (updateError) {
      logStep("Profile update error", { error: updateError });
    }

    logStep("Updated profile with definitive subscription info", { 
      subscribed: hasActiveSub, 
      subscriptionTier,
      subscriptionRenewal,
      subscriptionStateChanged: currentSubscriptionPlan !== subscriptionTier
    });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_renewal: subscriptionRenewal,
      subscription_end: subscriptionEnd,
      source: 'definitive_stripe_data'
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
