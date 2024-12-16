import { usePasswordChange } from "@/hooks/usePasswordChange";
import PasswordChangeHeader from "@/components/auth/change-password/PasswordChangeHeader";
import PasswordChangeForm from "@/components/auth/change-password/PasswordChangeForm";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { isLoading, handlePasswordChange } = usePasswordChange();

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