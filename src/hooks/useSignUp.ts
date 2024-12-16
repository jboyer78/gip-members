import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";
import { validatePasswords, validateCaptcha } from "./auth/validation";
import { checkSignupAttempts, recordSignupAttempt, handleSignupError } from "./auth/signupUtils";

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

      const canProceed = await checkSignupAttempts(email);
      if (!canProceed) return false;

      const attemptRecorded = await recordSignupAttempt(email);
      if (!attemptRecorded) return false;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirmed: false,
          },
        },
      });

      if (error) {
        return handleSignupError(error);
      }

      if (data?.user) {
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte",
        });
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