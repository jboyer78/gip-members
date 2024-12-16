import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";
import { validatePasswords, validateCaptcha } from "./auth/validation";

export interface UseSignUpProps {
  onSwitchToLogin?: () => void;
}

export const useSignUp = ({ onSwitchToLogin }: UseSignUpProps = {}) => {
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  const handleSignUp = async (
    email: string,
    password: string,
    confirmPassword: string,
    captchaToken: string | null
  ): Promise<boolean> => {
    try {
      if (!validatePasswords(password, confirmPassword)) return false;
      if (!validateCaptcha(captchaToken)) return false;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        console.error('SignUp error:', error);
        toast({
          variant: "destructive",
          title: "Erreur lors de l'inscription",
          description: error.message,
        });
        return false;
      }

      if (data?.user) {
        // Call the send-confirmation edge function
        const { error: confirmationError } = await supabase.functions.invoke('send-confirmation', {
          body: {
            email: email,
            confirmationUrl: `${window.location.origin}/login`,
          },
        });

        if (confirmationError) {
          console.error('Error sending confirmation email:', confirmationError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "L'inscription a réussi mais l'envoi de l'email de confirmation a échoué. Veuillez contacter le support.",
          });
        } else {
          toast({
            title: "Inscription réussie",
            description: "Veuillez vérifier votre email pour confirmer votre compte",
          });
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: "Une erreur inattendue est survenue",
      });
      return false;
    }
  };

  return {
    handleSignUp,
    isSignUpLoading,
  };
};