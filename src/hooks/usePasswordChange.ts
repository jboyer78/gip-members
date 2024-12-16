import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validatePassword } from "@/utils/validation";

export const usePasswordChange = (email: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePasswordChange = async (password: string, confirmPassword: string) => {
    try {
      if (!email) {
        throw new Error("Email manquant dans l'URL");
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      if (password !== confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      setIsLoading(true);

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      // Supprimer la tentative de réinitialisation
      const { error: deleteError } = await supabase
        .from('password_reset_attempts')
        .delete()
        .eq('email', email);

      if (deleteError) {
        console.error("Erreur lors de la suppression de la tentative:", deleteError);
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès",
      });
      
      // Redirect after a short delay to allow the toast to be seen
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error: any) {
      console.error("Erreur lors de la modification du mot de passe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de modifier le mot de passe. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handlePasswordChange
  };
};