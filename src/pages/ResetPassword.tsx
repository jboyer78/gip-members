import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetPasswordHeader from "@/components/auth/reset-password/ResetPasswordHeader";
import ResetPasswordActions from "@/components/auth/reset-password/ResetPasswordActions";
import EmailInput from "@/components/auth/reset-password/EmailInput";
import CountdownTimer from "@/components/auth/reset-password/CountdownTimer";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { useResetAttempts } from "@/hooks/useResetAttempts";
import { LanguageSelector } from "@/components/shared/LanguageSelector";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { isLoading, handleResetRequest } = usePasswordReset();
  const countdown = useResetAttempts(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleResetRequest(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 md:px-0">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md space-y-6 md:space-y-8 p-6 md:p-8 bg-white rounded-xl shadow">
        <div className="text-center">
          <img 
            src="/lovable-uploads/ac77944b-d66c-46a5-820f-1a60225b7102.png" 
            alt="Logo GIP" 
            className="w-44 h-44 mx-auto mb-4"
          />
        </div>

        <ResetPasswordHeader />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <EmailInput 
            email={email}
            onChange={setEmail}
          />

          <CountdownTimer countdown={countdown} />

          <ResetPasswordActions 
            isLoading={isLoading || countdown !== ""}
            onCancel={() => navigate("/login")}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;