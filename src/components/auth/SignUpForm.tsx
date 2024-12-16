import { useState } from "react";
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
        
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }
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