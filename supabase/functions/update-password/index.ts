import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordUpdateRequest {
  token: string;
  password: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, password }: PasswordUpdateRequest = await req.json();

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Verify token and get associated user
    const { data: tokenData, error: tokenError } = await supabaseAdmin
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

    // Update password using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      tokenData.user_id,
      { password }
    );

    if (updateError) {
      throw updateError;
    }

    // Mark token as used
    const { error: markUsedError } = await supabaseAdmin
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