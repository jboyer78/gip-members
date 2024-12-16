import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetRequest = async (email: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.functions.invoke("initiate-password-reset", {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: "Check your inbox to reset your password",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      console.error("Detailed error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while sending the reset email",
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