import { useState } from "react";
import { Button } from "@/components/ui/button";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import { LoginCaptcha } from "./login/LoginCaptcha";
import { toast } from "@/hooks/use-toast";
import { useSignUp } from "@/hooks/useSignUp";
import { useResetAttempts } from "@/hooks/useResetAttempts";
import CountdownTimer from "./reset-password/CountdownTimer";

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const { handleSignUp } = useSignUp();
  const countdown = useResetAttempts(signUpEmail);

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
        setShowVerificationMessage(true);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-green-600">Inscription réussie !</h3>
        <p className="text-gray-600">
          Un email de confirmation a été envoyé à votre adresse email.
          Veuillez cliquer sur le lien dans l'email pour activer votre compte.
        </p>
        <p className="text-sm text-gray-500">
          N'oubliez pas de vérifier vos spams si vous ne trouvez pas l'email.
        </p>
        <Button
          onClick={onSwitchToLogin}
          variant="outline"
          className="mt-4"
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

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

      {countdown && (
        <CountdownTimer countdown={countdown} />
      )}

      <LoginCaptcha onCaptchaChange={setCaptchaToken} />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !!countdown}
      >
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default SignUpForm;