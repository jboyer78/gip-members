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
      console.log("Starting login process for:", email);

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

      // Check if user exists and is verified
      const { data: userResponse, error: userError } = await supabase
        .from('profiles')
        .select('email_verified')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Error checking user:', userError);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la vérification de l'utilisateur",
        });
        return false;
      }

      if (!userResponse) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Aucun compte n'existe avec cet email",
        });
        return false;
      }

      if (!userResponse.email_verified) {
        toast({
          variant: "destructive",
          title: "Email non vérifié",
          description: "Veuillez vérifier votre email avant de vous connecter. Vérifiez vos spams si nécessaire.",
        });
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe // Persist session only if rememberMe is true
        }
      });

      if (error) {
        console.error('Auth error:', error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Mot de passe incorrect",
          });
        } else {
          handleAuthError(error as AuthError, toast);
        }
        
        return false;
      }

      if (data?.user) {
        console.log("Successfully logged in user:", data.user.email);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/profile");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Unexpected error during login:", error);
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

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Starting logout process...");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la déconnexion",
        });
        return;
      }

      console.log("Successfully logged out");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
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
    signOut,
    loading,
  };
};