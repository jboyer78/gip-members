import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl } = await req.json();
    console.log("Sending confirmation email to:", email);
    console.log("Redirect URL:", redirectUrl);

    // Create a signup token using Supabase's auth API
    const tokenResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password: crypto.randomUUID(), // temporary password
        data: { email_confirmed: false },
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Error generating signup token:", error);
      throw new Error("Failed to generate signup token");
    }

    const tokenData = await tokenResponse.json();
    const confirmationToken = tokenData.confirmation_token;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "contact@support.gip-france.org",
        to: [email],
        subject: "Confirmation de votre inscription",
        html: `
          <h1>Bienvenue sur GIP France</h1>
          <p>Merci de confirmer votre inscription en cliquant sur le lien ci-dessous :</p>
          <a href="${SUPABASE_URL}/auth/v1/verify?token=${confirmationToken}&type=signup&redirect_to=${redirectUrl}/login">
            Confirmer mon email
          </a>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);