import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIpCheck } from "@/hooks/useIpCheck";
import { useSignUp } from "@/hooks/useSignUp";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import { LoginCaptcha } from "./login/LoginCaptcha";

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