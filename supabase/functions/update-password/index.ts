import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { token, password } = await req.json();

    // Verify the token exists and is not expired or used
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from("password_reset_tokens")
      .select("user_id, used_at, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (tokenError || !tokenData) {
      throw new Error("Token invalide");
    }

    if (tokenData.used_at) {
      throw new Error("Ce lien a déjà été utilisé");
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error("Ce lien a expiré");
    }

    // Update the user's password
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      tokenData.user_id,
      { password }
    );

    if (updateError) {
      throw updateError;
    }

    // Mark token as used
    const { error: markUsedError } = await supabaseClient
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token);

    if (markUsedError) {
      console.error("Error marking token as used:", markUsedError);
    }

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});