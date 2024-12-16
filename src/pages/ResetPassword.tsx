import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ResetPasswordHeader from "@/components/auth/reset-password/ResetPasswordHeader";
import ResetPasswordActions from "@/components/auth/reset-password/ResetPasswordActions";
import EmailInput from "@/components/auth/reset-password/EmailInput";
import CountdownTimer from "@/components/auth/reset-password/CountdownTimer";

const RESET_COOLDOWN = 300000; // 5 minutes cooldown
const STORAGE_KEY = "lastPasswordResetAttempt";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<number>(0);
  const [countdown, setCountdown] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedLastAttempt = localStorage.getItem(STORAGE_KEY);
    if (storedLastAttempt) {
      setLastAttempt(parseInt(storedLastAttempt, 10));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getRemainingCooldown();
      if (remaining > 0) {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setCountdown("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastAttempt]);

  const updateLastAttempt = (timestamp: number) => {
    setLastAttempt(timestamp);
    localStorage.setItem(STORAGE_KEY, timestamp.toString());
  };

  const getRemainingCooldown = () => {
    const now = Date.now();
    const remaining = RESET_COOLDOWN - (now - lastAttempt);
    return Math.max(0, remaining);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const remainingCooldown = getRemainingCooldown();
    if (remainingCooldown > 0) {
      const remainingMinutes = Math.ceil(remainingCooldown / 60000);
      toast({
        variant: "destructive",
        title: "Trop de tentatives",
        description: `Veuillez attendre ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} avant de réessayer`,
      });
      return;
    }

    setIsLoading(true);
    updateLastAttempt(Date.now());

    try {
      const { error: functionError } = await supabase.functions.invoke('send-reset-password', {
        body: {
          to: [email],
          resetLink: `${window.location.origin}/change-password`,
        },
      });

      if (functionError) {
        console.error("Erreur fonction:", functionError);
        throw functionError;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email de réinitialisation. Veuillez réessayer plus tard.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || getRemainingCooldown() > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <ResetPasswordHeader />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <EmailInput 
            email={email}
            onChange={setEmail}
          />

          <CountdownTimer countdown={countdown} />

          <ResetPasswordActions 
            isLoading={isButtonDisabled}
            onCancel={() => navigate("/login")}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;