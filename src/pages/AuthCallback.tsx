import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during auth callback:', error);
        toast({
          variant: "destructive",
          title: "Erreur de vérification",
          description: "La vérification de votre email a échoué. Veuillez réessayer.",
        });
      } else {
        toast({
          title: "Email vérifié",
          description: "Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.",
        });
      }
      
      navigate('/login');
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Vérification de votre email en cours...</p>
      </div>
    </div>
  );
};

export default AuthCallback;