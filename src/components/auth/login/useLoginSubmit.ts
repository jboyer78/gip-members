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
      console.log("Starting login process for username:", username);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@placeholder.com`,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Identifiant ou mot de passe incorrect",
        });
        return;
      }

      if (data?.user) {
        console.log("Successfully logged in user:", username);
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