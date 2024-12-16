import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePasswordChange } from "@/hooks/usePasswordChange";
import PasswordChangeHeader from "@/components/auth/change-password/PasswordChangeHeader";
import PasswordChangeForm from "@/components/auth/change-password/PasswordChangeForm";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  
  const { isLoading, handlePasswordChange } = usePasswordChange(email);

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