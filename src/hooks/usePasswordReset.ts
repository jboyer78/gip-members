import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleResetRequest = async (email: string) => {
    try {
      setIsLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (profileError || !profileData) {
        toast({
          variant: "destructive",
          title: t("auth.resetPassword.errors.emailNotFound"),
          description: t("auth.resetPassword.errors.emailNotFound"),
        });
        return;
      }

      const { error: functionError } = await supabase.functions.invoke("initiate-password-reset", {
        body: { email },
      });

      if (functionError) {
        throw functionError;
      }

      toast({
        title: t("auth.resetPassword.success"),
        description: t("auth.resetPassword.successMessage"),
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      console.error("Error in reset request:", error);
      toast({
        variant: "destructive",
        title: t("auth.resetPassword.errors.generic"),
        description: error.message || t("auth.resetPassword.errors.generic"),
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