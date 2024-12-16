import { useState } from "react";
import { EmailInput } from "./login/EmailInput";
import { PasswordInput } from "./login/PasswordInput";
import { RememberMeCheckbox } from "./login/RememberMeCheckbox";
import { ForgotPasswordLink } from "./login/ForgotPasswordLink";
import { LoginCaptcha } from "./login/LoginCaptcha";
import { SubmitButton } from "./login/SubmitButton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // First check if the user exists and is verified
      const { data: userResponse, error: userError } = await supabase
        .from('profiles')
        .select('email_verified')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Error checking user:', userError);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la vérification de l'utilisateur",
        });
        return;
      }

      if (!userResponse) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Aucun compte n'existe avec cet email",
        });
        return;
      }

      // Attempt to sign in with redirect URL
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          redirectTo: 'https://gip-members.lovable.app/auth/callback'
        }
      });

      if (error) {
        console.error('Auth error:', error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Une erreur est survenue lors de la connexion",
          });
        }
        return;
      }

      if (data?.user) {
        console.log("Utilisateur connecté:", data.user);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
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