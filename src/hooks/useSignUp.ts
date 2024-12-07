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
      console.log("[Signup] Starting signup process for email:", email);
      
      // Vérifier d'abord si l'utilisateur existe
      const { data: { user: existingUser }, error: checkError } = await supabase.auth.getUser();
      
      if (existingUser) {
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

      // Procéder à l'inscription
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

      if (error) {
        console.error("[Signup] Error details:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
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
        console.log("[Signup] User created successfully:", {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at
        });

        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke(
            'send-confirmation',
            {
              body: JSON.stringify({ 
                email,
                redirectUrl: window.location.origin 
              })
            }
          );

          if (emailError) {
            console.error("[Signup] Error sending confirmation email:", emailError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "L'inscription a réussi mais l'envoi de l'email a échoué. Veuillez réessayer de vous connecter.",
            });
          } else {
            console.log("[Signup] Confirmation email sent successfully:", emailData);
            toast({
              title: "Inscription réussie",
              description: "Un email de confirmation vous a été envoyé",
            });
          }
        } catch (emailError) {
          console.error("[Signup] Error calling send-confirmation function:", emailError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "L'inscription a réussi mais l'envoi de l'email a échoué. Veuillez réessayer de vous connecter.",
          });
        }
        
        return true;
      }

      console.log("[Signup] No user data returned from signup");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
      return false;
    } catch (error) {
      console.error("[Signup] Unexpected error:", error);
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