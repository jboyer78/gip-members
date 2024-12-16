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

      // Check if there's a recent signup attempt for this email
      const { data: attempts, error: attemptsError } = await supabase
        .from('password_reset_attempts')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (attemptsError) {
        console.error('Error checking signup attempts:', attemptsError);
      } else if (attempts && attempts.length > 0) {
        const lastAttempt = attempts[0];
        const timeSinceLastAttempt = Date.now() - new Date(lastAttempt.last_attempt).getTime();
        const minimumWaitTime = 60000; // 1 minute in milliseconds

        if (timeSinceLastAttempt < minimumWaitTime) {
          const remainingSeconds = Math.ceil((minimumWaitTime - timeSinceLastAttempt) / 1000);
          toast({
            variant: "destructive",
            title: "Trop de tentatives",
            description: `Veuillez attendre ${remainingSeconds} secondes avant de réessayer`,
          });
          return false;
        }
      }

      // Record this attempt
      const { error: insertError } = await supabase
        .from('password_reset_attempts')
        .insert([
          { 
            email,
            last_attempt: new Date().toISOString(),
          }
        ]);

      if (insertError) {
        console.error('Error recording signup attempt:', insertError);
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: `/auth/callback`,
          data: {
            email_confirmed: false,
          },
        },
      });

      if (error) {
        console.error('SignUp error:', error);
        
        if (error.message.includes("rate limit")) {
          toast({
            variant: "destructive",
            title: "Trop de tentatives",
            description: "Veuillez attendre quelques minutes avant de réessayer",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur lors de l'inscription",
            description: error.message,
          });
        }
        return false;
      }

      if (data?.user) {
        // Send confirmation email using our edge function
        const confirmationUrl = `${window.location.origin}/auth/callback`;
        const response = await fetch(
          `${window.location.origin}/functions/v1/send-confirmation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              email,
              confirmationUrl,
            }),
          }
        );

        if (!response.ok) {
          console.error('Error sending confirmation email:', await response.text());
          toast({
            variant: "destructive",
            title: "Erreur lors de l'envoi de l'email",
            description: "Une erreur est survenue lors de l'envoi de l'email de confirmation",
          });
          return false;
        }

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