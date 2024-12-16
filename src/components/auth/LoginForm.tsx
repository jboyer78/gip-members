import { useState } from "react";
import { EmailInput } from "./login/EmailInput";
import { PasswordInput } from "./login/PasswordInput";
import { RememberMeCheckbox } from "./login/RememberMeCheckbox";
import { ForgotPasswordLink } from "./login/ForgotPasswordLink";
import { LoginCaptcha } from "./login/LoginCaptcha";
import { SubmitButton } from "./login/SubmitButton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const { signIn, loading } = useAuth();
  const { toast } = useToast();

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
      const result = await signIn(email, password, rememberMe);
      if (!result) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput password={password} setPassword={setPassword} />

        <div className="flex items-center justify-between">
          <RememberMeCheckbox 
            rememberMe={rememberMe} 
            setRememberMe={setRememberMe} 
          />
          <ForgotPasswordLink />
        </div>

        <LoginCaptcha onCaptchaChange={setCaptchaToken} />
      </div>

      <SubmitButton isLoading={loading} />
    </form>
  );
};

export default LoginForm;