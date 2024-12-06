import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/utils/validation";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";

const SignUpForm = () => {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation vous a été envoyé",
        });
        setSignUpEmail("");
        setSignUpPassword("");
        setConfirmPassword("");
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
      </div>

      <Button type="submit" className="w-full" disabled={isSignUpLoading}>
        {isSignUpLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default SignUpForm;