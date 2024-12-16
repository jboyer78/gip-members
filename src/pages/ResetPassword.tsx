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

    try {
      setIsLoading(true);

      // Vérifier les tentatives existantes
      const { data: existingAttempt, error: checkError } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error("Erreur lors de la vérification des tentatives");
      }

      if (existingAttempt?.last_attempt) {
        const lastAttempt = new Date(existingAttempt.last_attempt).getTime();
        const remainingCooldown = RESET_COOLDOWN - (Date.now() - lastAttempt);
        
        if (remainingCooldown > 0) {
          const remainingMinutes = Math.ceil(remainingCooldown / 60000);
          throw new Error(`Veuillez attendre ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} avant de réessayer`);
        }
      }

      // Use upsert instead of insert to handle existing records
      const { error: upsertError } = await supabase
        .from('password_reset_attempts')
        .upsert(
          { 
            email, 
            last_attempt: new Date().toISOString() 
          },
          { 
            onConflict: 'email',
            ignoreDuplicates: false 
          }
        );

      if (upsertError) {
        console.error("Upsert error:", upsertError);
        throw new Error("Erreur lors de l'enregistrement de la tentative");
      }

      // Generate reset link with proper URL encoding
      const resetLink = `${window.location.origin}/change-password?email=${encodeURIComponent(email)}`;
      
      // Send email
      const { error: functionError } = await supabase.functions.invoke('send-reset-password', {
        body: {
          to: [email],
          resetLink,
        },
      });

      if (functionError) {
        console.error("Function error:", functionError);
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
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email de réinitialisation",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            isLoading={isLoading || countdown !== ""}
            onCancel={() => navigate("/login")}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;