import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ResetPasswordHeader from "@/components/auth/reset-password/ResetPasswordHeader";
import ResetPasswordActions from "@/components/auth/reset-password/ResetPasswordActions";
import EmailInput from "@/components/auth/reset-password/EmailInput";
import CountdownTimer from "@/components/auth/reset-password/CountdownTimer";

const RESET_COOLDOWN = 300000; // 5 minutes cooldown

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing attempts on component mount and start countdown if needed
  useEffect(() => {
    const checkExistingAttempt = async () => {
      if (!email) return;
      
      const { data, error } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .single();

      if (error) {
        console.error("Error checking reset attempts:", error);
        return;
      }

      if (data) {
        const lastAttempt = new Date(data.last_attempt).getTime();
        updateCountdown(lastAttempt);
      }
    };

    checkExistingAttempt();
  }, [email]);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(async () => {
      if (!email) return;

      const { data, error } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .single();

      if (error || !data) {
        setCountdown("");
        return;
      }

      const lastAttempt = new Date(data.last_attempt).getTime();
      updateCountdown(lastAttempt);
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
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Error checking attempts:", checkError);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
      });
      return;
    }

    if (existingAttempt) {
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
      // Update or insert the attempt
      const { error: upsertError } = await supabase
        .from('password_reset_attempts')
        .upsert({
          email: email,
          last_attempt: new Date().toISOString()
        });

      if (upsertError) throw upsertError;

      const { error: functionError } = await supabase.functions.invoke('send-reset-password', {
        body: {
          to: [email],
          resetLink: `${window.location.origin}/change-password`,
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