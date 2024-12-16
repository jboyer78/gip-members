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

      // First check if we're within the rate limit period
      const { data: attempts, error: attemptsError } = await supabase
        .from('signup_attempts')
        .select('last_attempt')
        .eq('email', email)
        .order('last_attempt', { ascending: false })
        .limit(1);

      if (attemptsError) {
        console.error('Error checking signup attempts:', attemptsError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des tentatives",
        });
        return false;
      }

      if (attempts && attempts.length > 0) {
        const lastAttempt = new Date(attempts[0].last_attempt);
        const timeSinceLastAttempt = Date.now() - lastAttempt.getTime();
        const minimumWaitTime = 300000; // 5 minutes in milliseconds

        if (timeSinceLastAttempt < minimumWaitTime) {
          const remainingMinutes = Math.ceil((minimumWaitTime - timeSinceLastAttempt) / 60000);
          toast({
            variant: "destructive",
            title: "Trop de tentatives",
            description: `Veuillez attendre ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} avant de réessayer`,
          });
          return false;
        }
      }

      // Record this attempt before trying to sign up
      const { error: insertError } = await supabase
        .from('signup_attempts')
        .insert([{ 
          email,
          last_attempt: new Date().toISOString(),
        }]);

      if (insertError) {
        console.error('Error recording signup attempt:', insertError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de la tentative",
        });
        return false;
      }

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
        console.error('SignUp error:', error);
        
        if (error.message.includes("rate limit") || 
            error.message.includes("email rate limit exceeded") ||
            error.message.includes("over_email_send_rate_limit")) {
          toast({
            variant: "destructive",
            title: "Limite de tentatives atteinte",
            description: "Trop de tentatives d'inscription. Veuillez réessayer dans 5 minutes.",
          });
          return false;
        }
        
        toast({
          variant: "destructive",
          title: "Erreur lors de l'inscription",
          description: error.message,
        });
        return false;
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