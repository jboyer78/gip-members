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

      const { error } = await supabase.functions.invoke("update-password", {
        body: { token, password }
      });

      if (error) {
        throw error;
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