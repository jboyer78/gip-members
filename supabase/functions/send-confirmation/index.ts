import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  confirmation_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Handling confirmation email request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmation_url }: EmailRequest = await req.json();
    console.log("Received request for email:", email);
    console.log("Confirmation URL:", confirmation_url);

    if (!email || !confirmation_url) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Email and confirmation URL are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send confirmation email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GIP Members <no-reply@gip-members.lovable.app>",
        to: [email],
        subject: "Confirmez votre email - GIP Members",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <img src="https://gip-members.lovable.app/lovable-uploads/ac77944b-d66c-46a5-820f-1a60225b7102.png" 
                 alt="GIP Logo" 
                 style="width: 100px; margin: 20px auto; display: block;">
            <h1 style="color: #1a1a1a; text-align: center;">Confirmez votre email</h1>
            <p style="color: #666; line-height: 1.5; text-align: center;">
              Merci de vous être inscrit sur GIP Members. Pour finaliser votre inscription, 
              veuillez cliquer sur le bouton ci-dessous pour confirmer votre adresse email.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmation_url}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Confirmer mon email
              </a>
            </div>
            <p style="color: #666; font-size: 0.875rem; text-align: center;">
              Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur:<br>
              <span style="color: #2563eb;">${confirmation_url}</span>
            </p>
          </div>
        `,
      }),
    });

    const resData = await res.json().catch(async () => {
      // If JSON parsing fails, try to get the text response
      const text = await res.text();
      console.error("Failed to parse JSON response:", text);
      return { error: text };
    });

    console.log("Resend API response:", {
      status: res.status,
      data: resData
    });

    if (!res.ok) {
      console.error("Error from Resend API:", resData);
      return new Response(
        JSON.stringify({ error: "Failed to send confirmation email", details: resData }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);