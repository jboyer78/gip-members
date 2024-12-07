import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useIpCheck = () => {
  const [isCheckingIp, setIsCheckingIp] = useState(false);
  const { toast } = useToast();

  const checkIpAddress = async () => {
    setIsCheckingIp(true);
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const { ip } = await response.json();
      
      const { data, error } = await supabase.functions.invoke('check-ip', {
        body: { ip_address: ip }
      });

      if (error) {
        console.error("Erreur lors de la vérification de l'IP:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de l'IP",
        });
        return false;
      }

      if (data?.suspicious) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: data.message || "Activité suspecte détectée",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'IP:", error);
      return true; // En cas d'erreur, on permet la connexion pour ne pas bloquer les utilisateurs
    } finally {
      setIsCheckingIp(false);
    }
  };

  return { checkIpAddress, isCheckingIp };
};