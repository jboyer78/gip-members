import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Starting welcome email request handler");

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
    const { email, password, firstName, lastName }: WelcomeEmailRequest = await req.json();
    console.log("Request data:", { email, firstName, lastName });

    const loginUrl = "https://gip-members.lovable.app/login";

    console.log("Sending email via Resend API");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "G.I.P. <website@support.gip-france.org>",
        to: [email],
        bcc: ["boyer.jeanf@gmail.com"],
        subject: "Bienvenue sur GIP Members - Vos informations de connexion",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <img src="https://gip-members.lovable.app/lovable-uploads/ac77944b-d66c-46a5-820f-1a60225b7102.png" 
                 alt="GIP Logo" 
                 style="width: 100px; margin: 20px auto; display: block;">
            <h1 style="color: #1a1a1a; text-align: center;">Bienvenue sur GIP Members</h1>
            <p>Bonjour ${firstName} ${lastName},</p>
            <p>Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
            <ul>
              <li><strong>Email :</strong> ${email}</li>
              <li><strong>Mot de passe :</strong> ${password}</li>
            </ul>
            <p>Pour vous connecter, veuillez cliquer sur le lien suivant :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Se connecter
              </a>
            </div>
            <p>Nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
            <p>Cordialement,<br>L'équipe GIP</p>
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
    console.error("Error in send-welcome-email function:", error);
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