import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, formData: LoginFormData) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      setLoading(true);
      console.log("Starting login process for email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast("Email ou mot de passe incorrect");
        return;
      }

      if (data?.user) {
        console.log("Successfully logged in user:", data.user.email);
        toast("Connexion réussie");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};