import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { email } = await req.json() as EmailRequest;
    console.log("Processing password reset notification for:", email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "G.I.P. <website@support.gip-france.org>",
        to: ["admin@gip-france.org"],
        subject: "Demande de réinitialisation de mot de passe",
        html: `
          <h2>Demande de réinitialisation de mot de passe</h2>
          <p>Un utilisateur a demandé la réinitialisation de son mot de passe :</p>
          <p>Email : ${email}</p>
          <p>Pour réinitialiser le mot de passe, veuillez vous rendre sur <a href="https://gip-members.lovable.app">https://gip-members.lovable.app</a></p>
        `,
      }),
    });

    const resText = await res.text();
    console.log("Resend API response:", res.status, resText);

    if (!res.ok) {
      throw new Error(`Resend API error: ${resText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-reset-notification:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred",
        details: error instanceof Error ? error.toString() : "Unknown error"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);