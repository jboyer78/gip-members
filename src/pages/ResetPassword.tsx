import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetPasswordHeader from "@/components/auth/reset-password/ResetPasswordHeader";
import ResetPasswordActions from "@/components/auth/reset-password/ResetPasswordActions";
import EmailInput from "@/components/auth/reset-password/EmailInput";
import CountdownTimer from "@/components/auth/reset-password/CountdownTimer";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { useResetAttempts } from "@/hooks/useResetAttempts";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
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