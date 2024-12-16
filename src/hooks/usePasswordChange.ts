import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validatePasswords } from "@/utils/validation";

export const usePasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const handlePasswordChange = async (password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      const token = searchParams.get('token');

      if (!token) {
        throw new Error("Token manquant");
      }

      if (!validatePasswords(password, confirmPassword)) {
        throw new Error("Les mots de passe ne correspondent pas ou ne respectent pas les critères de sécurité");
      }

      // Verify token and get associated user
      const { data: tokenData, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('user_id, used_at, expires_at')
        .eq('token', token)
        .maybeSingle();

      if (tokenError || !tokenData) {
        throw new Error("Token invalide");
      }

      if (tokenData.used_at) {
        throw new Error("Ce lien a déjà été utilisé");
      }

      if (new Date(tokenData.expires_at) < new Date()) {
        throw new Error("Ce lien a expiré");
      }

      // Update password using admin API
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        tokenData.user_id,
        { password: password }
      );

      if (updateError) {
        throw updateError;
      }

      // Mark token as used
      const { error: markUsedError } = await supabase
        .from('password_reset_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token', token);

      if (markUsedError) {
        console.error("Error marking token as used:", markUsedError);
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la modification du mot de passe",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handlePasswordChange,
  };
};