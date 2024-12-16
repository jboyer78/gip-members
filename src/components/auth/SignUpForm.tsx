import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import { validateEmail, validatePassword } from "@/utils/validation";

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        toast.error(emailValidation.message);
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Un compte existe déjà avec cet email. Veuillez vous connecter.");
          if (onSwitchToLogin) {
            onSwitchToLogin();
          }
        } else {
          console.error("Error during signup:", error);
          toast.error("Une erreur est survenue lors de l'inscription");
        }
        return;
      }

      if (data) {
        toast.success(
          "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte."
        );
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <EmailField
        value={email}
        onChange={setEmail}
        label="Email"
      />

      <PasswordField
        id="signUpPassword"
        label="Mot de passe"
        value={password}
        onChange={setPassword}
        showHelperText={true}
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