import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const RESET_COOLDOWN = 300000; // 5 minutes cooldown

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetRequest = async (email: string) => {
    try {
      setIsLoading(true);

      // Check existing attempts
      const { data: existingAttempt, error: checkError } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error("Erreur lors de la vérification des tentatives");
      }

      if (existingAttempt?.last_attempt) {
        const lastAttempt = new Date(existingAttempt.last_attempt).getTime();
        const remainingCooldown = RESET_COOLDOWN - (Date.now() - lastAttempt);
        
        if (remainingCooldown > 0) {
          const remainingMinutes = Math.ceil(remainingCooldown / 60000);
          throw new Error(`Veuillez attendre ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} avant de réessayer`);
        }
      }

      // Get user ID from email
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) throw userError;

      const user = (users as User[]).find(u => u.email === email);
      if (!user) {
        throw new Error("Aucun compte trouvé avec cette adresse email");
      }

      // Generate secure token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

      // Store token
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString()
        });

      if (tokenError) {
        console.error("Token error:", tokenError);
        throw new Error("Erreur lors de la création du token");
      }

      // Update or create attempt record
      const { error: upsertError } = await supabase
        .from('password_reset_attempts')
        .upsert(
          { 
            email, 
            last_attempt: new Date().toISOString() 
          },
          { 
            onConflict: 'email' 
          }
        );

      if (upsertError) {
        console.error("Upsert error:", upsertError);
        throw new Error("Erreur lors de l'enregistrement de la tentative");
      }

      // Send email with token
      const resetLink = `${window.location.origin}/change-password?token=${encodeURIComponent(token)}`;
      
      const { error: functionError } = await supabase.functions.invoke('send-reset-password', {
        body: {
          to: [email],
          resetLink,
        },
      });

      if (functionError) {
        console.error("Function error:", functionError);
        throw functionError;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email de réinitialisation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleResetRequest,
  };
};