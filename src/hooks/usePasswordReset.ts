import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetRequest = async (email: string) => {
    try {
      setIsLoading(true);

      // Check if the email exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (profileError || !profileData) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Adresse email non trouvée",
        });
        return;
      }

      // Generate secure token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Get user ID from profiles
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) {
        throw userError;
      }

      const user = userData.users.find(u => u.email === email);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      // Store token
      const { error: tokenError } = await supabase
        .from("password_reset_tokens")
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString(),
        });

      if (tokenError) {
        throw tokenError;
      }

      // Send email with reset link
      const resetLink = `https://gip-members.lovable.app/change-password?token=${encodeURIComponent(token)}`;
      const { error: emailError } = await supabase.functions.invoke("send-reset-password", {
        body: {
          to: [email],
          resetLink,
        },
      });

      if (emailError) {
        throw emailError;
      }

      toast({
        title: "Email envoyé",
        description: "Un email de réinitialisation a été envoyé à votre adresse",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      console.error("Error in reset request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email",
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