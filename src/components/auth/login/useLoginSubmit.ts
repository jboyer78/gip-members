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
      console.log("Attempting to login with:", username);

      // Try direct sign in first (if username is an email)
      const { data: directSignIn, error: directError } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });

      if (!directError && directSignIn?.user) {
        console.log("User successfully logged in:", directSignIn.user);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/profile");
        return;
      }

      // If direct sign in fails, try to find the user by username
      const { data: userResponse, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .maybeSingle();

      if (userError) {
        console.error('Error checking user:', userError);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la vérification de l'utilisateur",
        });
        return;
      }

      if (!userResponse?.email) {
        console.log("No user found with username or email:", username);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Identifiant incorrect",
        });
        return;
      }

      // Try to sign in with the found email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userResponse.email,
        password
      });

      if (error) {
        console.error('Auth error:', error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Mot de passe incorrect",
        });
        return;
      }

      if (data?.user) {
        console.log("User successfully logged in:", data.user);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
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