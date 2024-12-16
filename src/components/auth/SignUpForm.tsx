import { useState } from "react";
import { Button } from "@/components/ui/button";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            email_confirmed: true
          }
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        toast.success("Inscription réussie !");
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmailField
        value={email}
        onChange={setEmail}
        label="Adresse email"
      />
      
      <PasswordField
        id="signUpPassword"
        label="Mot de passe"
        value={password}
        onChange={setPassword}
        showHelperText
      />
      
      <PasswordField
        id="confirmPassword"
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default SignUpForm;