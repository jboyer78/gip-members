import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIpCheck } from "./useIpCheck";
import { toast } from "./use-toast";
import { validatePasswords, validateCaptcha } from "./auth/validation";
import { handleSignUpError } from "./auth/errorHandling";
import { UseSignUpProps, SignUpResult, SignUpError } from "./auth/types";

export const useSignUp = ({ onSwitchToLogin }: UseSignUpProps = {}) => {
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const { checkIpAddress } = useIpCheck();

  const handleSignUp = async (
    email: string,
    password: string,
    confirmPassword: string,
    captchaToken: string | null
  ): Promise<boolean> => {
    try {
      setIsSignUpLoading(true);

      if (!validatePasswords(password, confirmPassword)) return false;
      if (!validateCaptcha(captchaToken)) return false;
      if (!await checkIpAddress()) return false;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        handleSignUpError(error);
        return false;
      }

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });

      if (onSwitchToLogin) {
        onSwitchToLogin();
      }

      return true;
    } catch (error) {
      handleSignUpError(error as SignUpError);
      return false;
    } finally {
      setIsSignUpLoading(false);
    }
  };

  return {
    handleSignUp,
    isSignUpLoading,
  };
};