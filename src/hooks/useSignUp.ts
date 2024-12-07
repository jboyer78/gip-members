import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/utils/validation";

export const useSignUp = (onSwitchToLogin?: () => void) => {
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (
    email: string,
    password: string,
    confirmPassword: string,
    captchaToken: string | null
  ) => {
    if (!captchaToken) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez compléter le CAPTCHA",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: passwordValidation.message,
      });
      return false;
    }

    setIsSignUpLoading(true);

    try {
      console.log("Starting signup process for email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            email_confirmed: false,
          }
        }
      });

      console.log("Signup API response:", { data, error });

      if (error) {
        console.error("Signup error details:", error);
        
        if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Compte existant",
            description: "Un compte existe déjà avec cette adresse email. Veuillez vous connecter.",
          });
          if (onSwitchToLogin) {
            onSwitchToLogin();
          }
          return false;
        }

        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message,
        });
        return false;
      }

      if (data.user) {
        console.log("User created successfully:", data.user);
        console.log("Confirmation email status:", {
          sent_at: data.user.confirmation_sent_at,
          email: data.user.email
        });
        
        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation vous a été envoyé",
        });
        
        return true;
      }

      console.log("No user data returned from signup");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
      return false;
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
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