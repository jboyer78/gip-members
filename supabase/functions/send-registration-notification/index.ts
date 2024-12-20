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
  console.log("Starting registration notification request handler");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("RESEND_API_KEY is not configured");
    }

    console.log("Parsing request body");
    const { firstName, lastName, birthDate, email }: RegistrationRequest = await req.json();
    console.log("Request data:", { firstName, lastName, birthDate, email });

    console.log("Sending email via Resend API");
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
            <img src="https://gip-members.lovable.app/lovable-uploads/ac77944b-d66c-46a5-820f-1a60225b7102.png" 
                 alt="GIP Logo" 
                 style="width: 100px; margin: 20px auto; display: block;">
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

    console.log("Resend API response status:", res.status);
    
    let responseData;
    try {
      responseData = await res.json();
      console.log("Resend API response data:", responseData);
    } catch (e) {
      const text = await res.text();
      console.error("Failed to parse Resend API response as JSON:", text);
      responseData = { error: text };
    }

    if (!res.ok) {
      console.error("Error from Resend API:", responseData);
      throw new Error(`Failed to send email: ${JSON.stringify(responseData)}`);
    }

    console.log("Email sent successfully");
    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-registration-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);