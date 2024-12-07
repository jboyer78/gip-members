import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useIpCheck = () => {
  const [isCheckingIp, setIsCheckingIp] = useState(false);
  const { toast } = useToast();

  const checkIpAddress = async () => {
    setIsCheckingIp(true);
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const { ip } = await response.json();
      
      const checkResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-ip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ ip_address: ip }),
        }
      );

      const result: { suspicious: boolean; message?: string } = await checkResponse.json();
      
      if (result.suspicious) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: result.message || "Activité suspecte détectée",
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