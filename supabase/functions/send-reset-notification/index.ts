import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetRequest {
  username: string;
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

    const { username, email }: ResetRequest = await req.json();
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "G.I.P. <website@support.gip-france.org>",
        to: ["boyer.jeanf@gmail.com"],
        subject: "Demande de réinitialisation de mot de passe",
        html: `
          <h2>Demande de réinitialisation de mot de passe</h2>
          <p>Un utilisateur a demandé la réinitialisation de son mot de passe :</p>
          <ul>
            <li><strong>Identifiant :</strong> ${username}</li>
            <li><strong>Email :</strong> ${email}</li>
          </ul>
        `,
      }),
    });

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
    console.error("Error sending notification:", error);
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