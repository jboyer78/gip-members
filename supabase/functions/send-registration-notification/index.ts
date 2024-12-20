import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Processing registration notification request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, birthDate, email }: RegistrationRequest = await req.json();
    console.log("Registration details:", { firstName, lastName, birthDate, email });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GIP Members <no-reply@gip-members.lovable.app>",
        to: ["boyer.jeanf@gmail.com"],
        subject: "Nouvelle demande d'inscription - GIP Members",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Nouvelle demande d'inscription</h1>
            <p>Une nouvelle demande d'inscription a été reçue avec les informations suivantes :</p>
            <ul>
              <li><strong>Nom :</strong> ${lastName}</li>
              <li><strong>Prénom :</strong> ${firstName}</li>
              <li><strong>Date de naissance :</strong> ${birthDate}</li>
              <li><strong>Email :</strong> ${email}</li>
            </ul>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error sending email:", errorText);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully");
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in registration notification:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);