import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetRequest = async (email: string, username: string) => {
    try {
      setIsLoading(true);

      // First check if the username exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Identifiant non trouvé",
        });
        return;
      }

      // Send notification to admin
      const { error: notificationError } = await supabase.functions.invoke('send-reset-notification', {
        body: { username, email }
      });

      if (notificationError) {
        console.error("Error sending notification:", notificationError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi de la notification",
        });
        return;
      }

      toast({
        title: "Demande envoyée",
        description: "Votre demande a été transmise à l'administrateur",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      console.error("Error in reset request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de la demande",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleResetRequest,
  };
};