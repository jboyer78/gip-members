import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESET_COOLDOWN = 300000; // 5 minutes

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log("Processing password reset request for email:", email);

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Check for existing attempts
    console.log("Checking for existing reset attempts...");
    const { data: existingAttempt, error: checkError } = await supabaseAdmin
      .from("password_reset_attempts")
      .select("last_attempt")
      .eq("email", email)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking reset attempts:", checkError);
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
    console.log("Fetching user details...");
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error("Error fetching user:", userError);
      throw userError;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error("No account found with this email address");
    }

    // Generate secure token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Store token
    console.log("Storing reset token...");
    const { error: tokenError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Token storage error:", tokenError);
      throw new Error("Error creating reset token");
    }

    // Update or create attempt record
    console.log("Recording reset attempt...");
    const { error: upsertError } = await supabaseAdmin
      .from("password_reset_attempts")
      .upsert(
        { 
          email, 
          last_attempt: new Date().toISOString() 
        },
        { 
          onConflict: "email",
          ignoreDuplicates: false
        }
      );

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      throw new Error("Error recording reset attempt");
    }

    // Send email with token
    const resetLink = `${req.headers.get("origin")}/change-password?token=${encodeURIComponent(token)}`;
    console.log("Sending reset email...");
    
    const { error: functionError } = await supabaseAdmin.functions.invoke("send-reset-password", {
      body: {
        to: [email],
        resetLink,
      },
    });

    if (functionError) {
      console.error("Email function error:", functionError);
      throw functionError;
    }

    console.log("Password reset process completed successfully");
    return new Response(
      JSON.stringify({ message: "Password reset email sent successfully" }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in password reset process:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred",
        details: error instanceof Error ? error.toString() : "Unknown error"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});