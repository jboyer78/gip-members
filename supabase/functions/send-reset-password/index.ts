import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailRequest: EmailRequest = await req.json();
    console.log("Sending reset password email to:", emailRequest.to);
    console.log("Reset link:", emailRequest.resetLink);
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "G.I.P. <website@support.gip-france.org>",
        to: emailRequest.to,
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
          <p><a href="${emailRequest.resetLink}">Réinitialiser mon mot de passe</a></p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
          <p>Ce lien expirera dans 24 heures.</p>
        `,
      }),
    });

    // Log de la réponse de Resend pour le debugging
    const resText = await res.text();
    console.log("Resend API response:", res.status, resText);

    if (!res.ok) {
      console.error("Error from Resend API:", resText);
      throw new Error(`Resend API error: ${resText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Detailed error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);