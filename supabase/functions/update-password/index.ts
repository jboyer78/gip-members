import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Début du traitement de la requête de mise à jour du mot de passe");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { token, password } = await req.json();
    console.log("Token reçu, vérification en cours...");

    // Verify the token exists and is not expired or used
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from("password_reset_tokens")
      .select("user_id, used_at, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (tokenError) {
      console.error("Erreur lors de la vérification du token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la vérification du token" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!tokenData) {
      console.error("Token non trouvé dans la base de données");
      return new Response(
        JSON.stringify({ error: "Token invalide ou expiré" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (tokenData.used_at) {
      console.error("Token déjà utilisé le:", tokenData.used_at);
      return new Response(
        JSON.stringify({ error: "Ce lien de réinitialisation a déjà été utilisé" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      console.error("Token expiré le:", tokenData.expires_at);
      return new Response(
        JSON.stringify({ error: "Le lien de réinitialisation a expiré" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Token valide, mise à jour du mot de passe...");

    // Update the user's password
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      tokenData.user_id,
      { password }
    );

    if (updateError) {
      console.error("Erreur lors de la mise à jour du mot de passe:", updateError);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de la mise à jour du mot de passe. Veuillez réessayer." 
        }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Mot de passe mis à jour avec succès, marquage du token comme utilisé...");

    // Mark token as used
    const { error: markUsedError } = await supabaseClient
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token);

    if (markUsedError) {
      console.error("Erreur lors du marquage du token comme utilisé:", markUsedError);
    }

    console.log("Processus terminé avec succès");

    return new Response(
      JSON.stringify({ message: "Mot de passe mis à jour avec succès" }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Erreur serveur:", error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
        details: error.message 
      }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});