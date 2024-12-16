import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword } from "./auth/validation";
import { handleAuthError } from "./auth/errorHandling";
import { AuthError } from "@supabase/supabase-js";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setLoading(true);

      // Validate inputs
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      if (emailError || passwordError) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: emailError || passwordError,
        });
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Auth error:', error);
        
        // Parse the error body if it exists
        try {
          const errorBody = JSON.parse(error.message);
          if (errorBody.code === "invalid_credentials") {
            toast({
              variant: "destructive",
              title: "Erreur de connexion",
              description: "Veuillez vérifier votre email et votre mot de passe",
            });
          } else {
            handleAuthError(error as AuthError, toast);
          }
        } catch {
          handleAuthError(error as AuthError, toast);
        }
        
        return false;
      }

      if (data?.user) {
        console.log("Utilisateur connecté:", data.user);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Validate inputs
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      if (emailError || passwordError) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: emailError || passwordError,
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        handleAuthError(error as AuthError, toast);
        return;
      }

      if (data) {
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    loading,
  };
};