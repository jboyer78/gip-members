import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESET_COOLDOWN = 300000; // 5 minutes

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Check for existing attempts
    const { data: existingAttempt, error: checkError } = await supabaseAdmin
      .from("password_reset_attempts")
      .select("last_attempt")
      .eq("email", email)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error("Error checking reset attempts");
    }

    if (existingAttempt?.last_attempt) {
      const lastAttempt = new Date(existingAttempt.last_attempt).getTime();
      const remainingCooldown = RESET_COOLDOWN - (Date.now() - lastAttempt);
      
      if (remainingCooldown > 0) {
        const remainingMinutes = Math.ceil(remainingCooldown / 60000);
        throw new Error(`Please wait ${remainingMinutes} minute(s) before trying again`);
      }
    }

    // Get user from auth.users
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;

    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error("No account found with this email address");
    }

    // Generate secure token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Store token
    const { error: tokenError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Token error:", tokenError);
      throw new Error("Error creating reset token");
    }

    // Update or create attempt record
    const { error: upsertError } = await supabaseAdmin
      .from("password_reset_attempts")
      .upsert(
        { 
          email, 
          last_attempt: new Date().toISOString() 
        },
        { 
          onConflict: "email",
        }
      );

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      throw new Error("Error recording reset attempt");
    }

    // Send email with token
    const resetLink = `${req.headers.get("origin")}/change-password?token=${encodeURIComponent(token)}`;
    
    const { error: functionError } = await supabaseAdmin.functions.invoke("send-reset-password", {
      body: {
        to: [email],
        resetLink,
      },
    });

    if (functionError) {
      console.error("Function error:", functionError);
      throw functionError;
    }

    return new Response(
      JSON.stringify({ message: "Password reset email sent successfully" }), 
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