import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent, credentials: LoginCredentials) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await signIn(credentials.email, credentials.password);
      
      if (success) {
        toast({
          title: t('auth.success.login'),
          description: t('auth.success.welcome'),
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: t('auth.errors.generalError'),
        description: error instanceof Error ? error.message : t('auth.errors.invalidCredentials'),
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};