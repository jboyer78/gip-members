import { usePasswordChange } from "@/hooks/usePasswordChange";
import PasswordChangeHeader from "@/components/auth/change-password/PasswordChangeHeader";
import PasswordChangeForm from "@/components/auth/change-password/PasswordChangeForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePassword } from "@/utils/validation";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
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

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: passwordValidation.message,
        });
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "Les mots de passe ne correspondent pas",
        });
        return;
      }

      const response = await fetch(
        "https://fzxkiwrungrwptlueoqt.supabase.co/functions/v1/update-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.error || "Une erreur est survenue lors de la modification du mot de passe",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error changing password:", error);
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