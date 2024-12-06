import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/utils/validation";

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
        // Reset form
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
        <div>
          <Label htmlFor="signUpEmail">Adresse email</Label>
          <Input
            id="signUpEmail"
            type="email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            placeholder="exemple@email.com"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="signUpPassword">Mot de passe</Label>
          <Input
            id="signUpPassword"
            type="password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            required
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*(),.?":{}|&lt;&gt;)
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSignUpLoading}>
        {isSignUpLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default SignUpForm;