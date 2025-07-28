
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[EXPIRE-SUBSCRIPTIONS] ${step}${detailsStr}`);
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
    logStep("Expire subscriptions job started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get all profiles with unlimited subscriptions (but exclude manual_unlimited completely)
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, stripe_customer_id, subscription_plan, manual_unlimited')
      .eq('subscription_plan', 'unlimited')
      .neq('subscription_plan', 'manual_unlimited');

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    logStep("Found unlimited profiles", { count: profiles?.length || 0 });

    let expiredCount = 0;

    for (const profile of profiles || []) {
      // FIRST CHECK: Skip ALL processing for manually unlimited users
      if (profile.manual_unlimited === true) {
        logStep("Skipping ALL validation for manual unlimited user", { userId: profile.id });
        continue;
      }

      // SECOND CHECK: Skip manual_unlimited subscription plan completely
      if (profile.subscription_plan === 'manual_unlimited') {
        logStep("Skipping manual_unlimited subscription plan", { userId: profile.id });
        continue;
      }

      // Only process users with Stripe customer IDs for subscription validation
      if (!profile.stripe_customer_id) {
        logStep("No Stripe customer ID found, reverting to free", { userId: profile.id });
        
        // Revert to free plan for users without Stripe customer ID (unless manual_unlimited)
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({
            subscription_plan: 'free',
            subscription_renewal: 'monthly'
          })
          .eq('id', profile.id);

        if (updateError) {
          logStep("Failed to update profile to free", { userId: profile.id, error: updateError });
        } else {
          logStep("Profile reverted to free (no customer ID)", { userId: profile.id });
          expiredCount++;
        }

        // Update subscribers table
        const { error: subscriberError } = await supabaseClient
          .from('subscribers')
          .update({
            subscribed: false,
            subscription_tier: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', profile.id);

        if (subscriberError) {
          logStep("Failed to update subscriber record", { userId: profile.id, error: subscriberError });
        }
        
        continue;
      }

      try {
        // Check subscription status in Stripe
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: "all",
          limit: 10,
        });

        const hasValidSubscription = subscriptions.data.some(sub => 
          (sub.status === 'active' || sub.status === 'canceled') && 
          sub.current_period_end * 1000 > Date.now()
        );

        if (!hasValidSubscription) {
          // Revert to free plan
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
              subscription_plan: 'free',
              subscription_renewal: 'monthly'
            })
            .eq('id', profile.id);

          if (updateError) {
            logStep("Failed to update profile to free", { userId: profile.id, error: updateError });
          } else {
            logStep("Profile reverted to free", { userId: profile.id });
            expiredCount++;
          }

          // Update subscribers table
          const { error: subscriberError } = await supabaseClient
            .from('subscribers')
            .update({
              subscribed: false,
              subscription_tier: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', profile.id);

          if (subscriberError) {
            logStep("Failed to update subscriber record", { userId: profile.id, error: subscriberError });
          }
        }
      } catch (error) {
        logStep("Error checking subscription for profile", { userId: profile.id, error: error.message });
      }
    }

    logStep("Expire subscriptions job completed", { expiredCount });

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Expired ${expiredCount} subscriptions` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in expire-subscriptions", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
