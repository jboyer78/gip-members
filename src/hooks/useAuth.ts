import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: undefined,
        }
      });

      if (error) {
        // En cas d'erreur, on vérifie et incrémente le compteur IP
        const { data: clientData } = await supabase.auth.getSession();
        const clientIp = clientData?.session?.user?.user_metadata?.client_ip;

        if (clientIp) {
          const response = await fetch('https://fzxkiwrungrwptlueoqt.supabase.co/functions/v1/check-ip', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ ip_address: clientIp }),
          });

          const ipCheck = await response.json();
          if (ipCheck.suspicious) {
            toast({
              variant: "destructive",
              title: "Accès bloqué",
              description: ipCheck.message || "Trop de tentatives. Veuillez réessayer plus tard.",
            });
            return false;
          }
        }

        let errorMessage = "L'email ou le mot de passe est incorrect";
        
        // Handle specific error cases
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe invalide";
        }

        console.log("Login error details:", error);

        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: errorMessage,
        });
        return false;
      }

      if (data.user) {
        // Check if user is banned
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('banned_at')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Error checking ban status:", profileError);
        }

        if (profileData?.banned_at) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Votre compte a été suspendu. Veuillez contacter l'administrateur.",
          });
          // Sign out the banned user
          await supabase.auth.signOut();
          return false;
        }

        // If rememberMe is true, set session expiry to 30 days
        if (rememberMe && data.session) {
          const { data: sessionData } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
          console.log("Session updated:", sessionData);
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace personnel",
        });
        navigate("/dashboard");
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
      setIsLoading(false);
    }
  };

  return { signIn, isLoading };
};