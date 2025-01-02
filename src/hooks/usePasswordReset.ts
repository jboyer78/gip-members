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

      // Call the Edge Function to handle the reset process
      const { error: functionError } = await supabase.functions.invoke("initiate-password-reset", {
        body: { email },
      });

      if (functionError) {
        throw functionError;
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