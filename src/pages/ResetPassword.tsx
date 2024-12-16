import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ResetPasswordHeader from "@/components/auth/reset-password/ResetPasswordHeader";
import ResetPasswordActions from "@/components/auth/reset-password/ResetPasswordActions";
import EmailInput from "@/components/auth/reset-password/EmailInput";
import CountdownTimer from "@/components/auth/reset-password/CountdownTimer";
import { Database } from "@/integrations/supabase/types/database";

const RESET_COOLDOWN = 300000; // 5 minutes cooldown

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkExistingAttempt = async () => {
      if (!email) return;
      
      const { data, error } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking reset attempts:", error);
        return;
      }

      if (data?.last_attempt) {
        updateCountdown(new Date(data.last_attempt).getTime());
      }
    };

    checkExistingAttempt();
  }, [email]);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (!email) return;

      const { data, error } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking attempts:", error);
        setCountdown("");
        return;
      }

      if (data?.last_attempt) {
        updateCountdown(new Date(data.last_attempt).getTime());
      } else {
        setCountdown("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const updateCountdown = (lastAttempt: number) => {
    const now = Date.now();
    const remaining = RESET_COOLDOWN - (now - lastAttempt);
    
    if (remaining > 0) {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    } else {
      setCountdown("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for existing attempts
    const { data: existingAttempt, error: checkError } = await supabase
      .from('password_reset_attempts')
      .select('last_attempt')
      .eq('email', email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking attempts:", checkError);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
      });
      return;
    }

    if (existingAttempt?.last_attempt) {
      const lastAttempt = new Date(existingAttempt.last_attempt).getTime();
      const remainingCooldown = RESET_COOLDOWN - (Date.now() - lastAttempt);
      
      if (remainingCooldown > 0) {
        const remainingMinutes = Math.ceil(remainingCooldown / 60000);
        toast({
          variant: "destructive",
          title: "Trop de tentatives",
          description: `Veuillez attendre ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} avant de réessayer`,
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // First try to update if exists, then insert if not
      const { error: updateError } = await supabase
        .from('password_reset_attempts')
        .update({ last_attempt: new Date().toISOString() })
        .eq('email', email);

      if (updateError && updateError.code === 'PGRST116') {
        // If no row to update, then insert
        const { error: insertError } = await supabase
          .from('password_reset_attempts')
          .insert({ email, last_attempt: new Date().toISOString() });

        if (insertError) throw insertError;
      } else if (updateError) {
        throw updateError;
      }

      const resetLink = `${window.location.origin}/change-password?email=${encodeURIComponent(email)}`;
      
      const { error: functionError } = await supabase.functions.invoke('send-reset-password', {
        body: {
          to: [email],
          resetLink,
        },
      });

      if (functionError) throw functionError;

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

  const isButtonDisabled = isLoading || countdown !== "";

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