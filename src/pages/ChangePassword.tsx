import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PasswordField from "@/components/auth/PasswordField";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/utils/validation";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Email manquant dans l'URL",
      });
      navigate("/login");
    }
  }, [email, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!email) {
        throw new Error("Email manquant dans l'URL");
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      if (password !== confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      setIsLoading(true);

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      // Supprimer la tentative de réinitialisation
      const { error: deleteError } = await supabase
        .from('password_reset_attempts')
        .delete()
        .eq('email', email);

      if (deleteError) {
        console.error("Erreur lors de la suppression de la tentative:", deleteError);
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error: any) {
      console.error("Erreur lors de la modification du mot de passe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de modifier le mot de passe. Veuillez réessayer.",
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