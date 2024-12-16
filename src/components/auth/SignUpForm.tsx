import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIpCheck } from "@/hooks/useIpCheck";
import { useSignUp } from "@/hooks/useSignUp";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import { LoginCaptcha } from "./login/LoginCaptcha";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { checkIpAddress, isCheckingIp } = useIpCheck();
  const { handleSignUp, isSignUpLoading } = useSignUp({ onSwitchToLogin });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const ipCheck = await checkIpAddress();
      if (!ipCheck) return;

      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          captchaToken,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Send confirmation email using our Edge Function
        const { error: emailError } = await supabase.functions.invoke('send-confirmation', {
          body: {
            email: signUpEmail,
            confirmationUrl: `${window.location.origin}/login?email=${encodeURIComponent(signUpEmail)}`,
          },
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
          throw new Error('Failed to send confirmation email');
        }

        setSignUpEmail("");
        setSignUpPassword("");
        setConfirmPassword("");
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte",
        });

        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <EmailField 
          value={signUpEmail}
          onChange={setSignUpEmail}
          label="Adresse email"
        />

        <PasswordField
          id="signUpPassword"
          label="Mot de passe"
          value={signUpPassword}
          onChange={setSignUpPassword}
          showHelperText={true}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <LoginCaptcha onCaptchaChange={setCaptchaToken} />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isSignUpLoading || isCheckingIp}
      >
        {isSignUpLoading || isCheckingIp ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default SignUpForm;