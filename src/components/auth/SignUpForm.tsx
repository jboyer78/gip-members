import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/utils/validation";
import { useIpCheck } from "@/hooks/useIpCheck";
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
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkIpAddress, isCheckingIp } = useIpCheck();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez compléter le CAPTCHA",
      });
      return;
    }

    const ipCheck = await checkIpAddress();
    if (!ipCheck) return;

    setIsSignUpLoading(true);

    if (signUpPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      setIsSignUpLoading(false);
      return;
    }

    const passwordValidation = validatePassword(signUpPassword);
    if (!passwordValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: passwordValidation.message,
      });
      setIsSignUpLoading(false);
      return;
    }

    try {
      console.log("Attempting signup with email:", signUpEmail);
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
      });

      console.log("Signup response:", { data, error });

      if (error) {
        console.log("Signup error:", error);
        
        if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Compte existant",
            description: "Un compte existe déjà avec cette adresse email. Veuillez vous connecter.",
          });
          if (onSwitchToLogin) {
            onSwitchToLogin();
          }
          return;
        }

        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("User created successfully:", data.user);
        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation vous a été envoyé",
        });
        setSignUpEmail("");
        setSignUpPassword("");
        setConfirmPassword("");
      } else {
        console.log("No user data returned");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'inscription",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsSignUpLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="mt-8 space-y-6">
      <div className="space-y-4">
        <EmailField 
          value={signUpEmail}
          onChange={setSignUpEmail}
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
        className="w-full" 
        disabled={isSignUpLoading || isCheckingIp}
      >
        {isSignUpLoading || isCheckingIp ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default SignUpForm;