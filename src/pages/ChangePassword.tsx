import { usePasswordChange } from "@/hooks/usePasswordChange";
import PasswordChangeHeader from "@/components/auth/change-password/PasswordChangeHeader";
import PasswordChangeForm from "@/components/auth/change-password/PasswordChangeForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { isLoading, handlePasswordChange } = usePasswordChange();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Lien invalide. Veuillez demander un nouveau lien de réinitialisation.",
      });
      navigate("/login");
    }
  }, [searchParams, navigate, toast]);

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