import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormData {
  username: string;
  password: string;
}

export const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, formData: LoginFormData) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      setLoading(true);
      console.log("Starting login process for:", username);

      // First, try to find user by username
      console.log("Looking up user by username:", username);
      const { data: userResponse, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .maybeSingle();

      if (userError) {
        console.error('Error looking up user:', userError);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la vérification de l'utilisateur",
        });
        return;
      }

      if (!userResponse?.email) {
        console.log("No user found with username:", username);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Identifiant incorrect",
        });
        return;
      }

      console.log("Found user email, attempting login with email:", userResponse.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userResponse.email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Mot de passe incorrect",
        });
        return;
      }

      if (data?.user) {
        console.log("Successfully logged in user:", data.user.email);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};