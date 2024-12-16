import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";
import { validatePasswords, validateCaptcha } from "./auth/validation";
import { checkSignupAttempts, recordSignupAttempt } from "./auth/signupUtils";

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
      console.log("Starting signup process...");
      
      if (!validatePasswords(password, confirmPassword)) return false;
      if (!validateCaptcha(captchaToken)) return false;

      const canProceed = await checkSignupAttempts(email);
      if (!canProceed) return false;

      const attemptRecorded = await recordSignupAttempt(email);
      if (!attemptRecorded) return false;

      console.log("Attempting signup with Supabase...");
      const { data: { session, user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: 'https://gip-members.lovable.app/auth/callback',
          data: {
            email_confirmed: false,
          }
        },
      });

      if (error) {
        console.error("SignUp error details:", {
          name: error.name,
          message: error.message,
          status: error.status,
          code: error?.code
        });
        
        // Parse error body if it exists
        let errorBody;
        try {
          if (typeof error.message === 'string' && error.message.includes('body')) {
            const match = error.message.match(/{.*}/);
            if (match) {
              errorBody = JSON.parse(match[0]);
            }
          }
        } catch (e) {
          console.error('Error parsing error body:', e);
        }

        if (errorBody?.message === "Error sending confirmation email") {
          toast({
            variant: "destructive",
            title: "Erreur lors de l'envoi de l'email",
            description: "Une erreur est survenue lors de l'envoi de l'email de confirmation. Veuillez réessayer.",
          });
        } else if (error.message.includes("Email rate limit exceeded")) {
          toast({
            variant: "destructive",
            title: "Limite atteinte",
            description: "Trop de tentatives. Veuillez réessayer plus tard.",
          });
        } else if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Utilisateur déjà inscrit",
            description: "Un compte existe déjà avec cet email.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur lors de l'inscription",
            description: "Une erreur est survenue. Veuillez réessayer.",
          });
        }
        return false;
      }

      if (user) {
        console.log("Signup successful, user created:", user.id);
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Unexpected error during signup:", error);
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