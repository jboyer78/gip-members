import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, formData: LoginFormData) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      setLoading(true);
      console.log("Starting login process for email:", email);

      // First check if there's an existing session and clear it
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.log("Clearing existing session due to error:", sessionError);
        await supabase.auth.signOut();
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: true // Ensure the session is persisted
        }
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes("session_not_found")) {
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Veuillez vous reconnecter",
          });
          // Force a sign out to clear any invalid session data
          await supabase.auth.signOut();
          return;
        }

        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
        return;
      }

      if (data?.user) {
        console.log("Successfully logged in user:", email);
        
        // Verify the session was created
        const { data: sessionData, error: sessionCheckError } = await supabase.auth.getSession();
        
        if (sessionCheckError || !sessionData.session) {
          console.error("Session verification failed:", sessionCheckError);
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Impossible de créer une session. Veuillez réessayer.",
          });
          return;
        }

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