import { usePasswordChange } from "@/hooks/usePasswordChange";
import PasswordChangeHeader from "@/components/auth/change-password/PasswordChangeHeader";
import PasswordChangeForm from "@/components/auth/change-password/PasswordChangeForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePassword } from "@/utils/validation";
import { supabase } from "@/integrations/supabase/client";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      console.error("Token manquant dans l'URL");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le lien de réinitialisation est invalide. Veuillez demander un nouveau lien de réinitialisation.",
      });
      navigate("/login");
    }
  }, [searchParams, navigate, toast]);

  const handlePasswordChange = async (password: string, confirmPassword: string) => {
    const token = searchParams.get('token');
    if (!token) return;

    try {
      setIsLoading(true);
      console.log("Début de la modification du mot de passe");

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        console.log("Échec de la validation du mot de passe:", passwordValidation.message);
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: passwordValidation.message,
        });
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        console.log("Les mots de passe ne correspondent pas");
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "Les mots de passe ne correspondent pas",
        });
        return;
      }

      console.log("Envoi de la requête à l'API");
      const { data, error } = await supabase.functions.invoke("update-password", {
        body: { token, password },
      });

      if (error) {
        console.error("Erreur lors de la mise à jour:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la modification du mot de passe",
        });
        return;
      }

      console.log("Mot de passe modifié avec succès");
      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès",
      });

      navigate("/login");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <PasswordChangeHeader />
        <PasswordChangeForm
          onSubmit={handlePasswordChange}
          isLoading={isLoading}
          onCancel={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

export default ChangePassword;