import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PasswordField from "@/components/auth/PasswordField";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword, validatePasswords } from "@/utils/validation";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Check if we have a recovery token in the URL
  const isPasswordRecovery = searchParams.has("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: passwordValidation.message,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    setIsLoading(true);

    try {
      let error;

      if (isPasswordRecovery) {
        // Use the recovery flow
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        }, {
          emailRedirectTo: `${window.location.origin}/login`
        });
        error = updateError;
      } else {
        // Use the standard update password flow for authenticated users
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });
        error = updateError;
      }

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le mot de passe. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Modification du mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entrez votre nouveau mot de passe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <PasswordField
              id="new-password"
              label="Nouveau mot de passe"
              value={password}
              onChange={setPassword}
              showHelperText
            />

            <PasswordField
              id="confirm-password"
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              Retour à la connexion
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;