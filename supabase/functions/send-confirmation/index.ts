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

    // Vérifier si l'utilisateur existe déjà
    const checkUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const users = await checkUserResponse.json();
    const existingUser = users.find((user: any) => user.email === email);

    if (existingUser) {
      console.log("User already exists, sending password reset email instead");
      // Envoyer un email de réinitialisation de mot de passe
      const resetResponse = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          email,
          gotrue_meta_security: {},
        }),
      });

      if (!resetResponse.ok) {
        throw new Error("Failed to send password reset email");
      }

      return new Response(
        JSON.stringify({ message: "Password reset email sent" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Si l'utilisateur n'existe pas, procéder à l'inscription
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
          <a href="${redirectUrl}/login">
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