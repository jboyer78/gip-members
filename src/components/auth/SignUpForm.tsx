import { useState } from "react";
import { useIpCheck } from "@/hooks/useIpCheck";
import { Button } from "@/components/ui/button";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import { LoginCaptcha } from "./login/LoginCaptcha";
import { toast } from "@/hooks/use-toast";
import { useSignUp } from "@/hooks/useSignUp";

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { checkIpAddress } = useIpCheck();
  const { handleSignUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez compléter le CAPTCHA",
      });
      return;
    }

    try {
      setLoading(true);
      
      const ipCheck = await checkIpAddress();
      if (!ipCheck) return;

      const success = await handleSignUp(
        signUpEmail,
        signUpPassword,
        confirmPassword,
        captchaToken
      );

      if (success) {
        setSignUpEmail("");
        setSignUpPassword("");
        setConfirmPassword("");
        setCaptchaToken(null);
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
        title: "Erreur lors de l'inscription",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        showHelperText
      />
      
      <PasswordField
        id="confirmPassword"
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      <LoginCaptcha onCaptchaChange={setCaptchaToken} />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default SignUpForm;