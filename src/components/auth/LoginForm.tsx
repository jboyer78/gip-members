import { useState } from "react";
import { EmailInput } from "./login/EmailInput";
import { PasswordInput } from "./login/PasswordInput";
import { RememberMeCheckbox } from "./login/RememberMeCheckbox";
import { ForgotPasswordLink } from "./login/ForgotPasswordLink";
import { SubmitButton } from "./login/SubmitButton";
import { useLoginSubmit } from "./login/useLoginSubmit";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { session } = useSessionContext();
  const navigate = useNavigate();
  
  const { handleSubmit, loading } = useLoginSubmit();

  useEffect(() => {
    if (session) {
      navigate("/profile");
    }
  }, [session, navigate]);

  return (
    <form onSubmit={(e) => handleSubmit(e, { email, password })} className="mt-8 space-y-6">
      <div className="space-y-4">
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput password={password} setPassword={setPassword} />

        <div className="flex items-center justify-between">
          <RememberMeCheckbox 
            rememberMe={rememberMe} 
            setRememberMe={setRememberMe} 
          />
          <ForgotPasswordLink />
        </div>
      </div>

      <SubmitButton isLoading={loading} />
    </form>
  );
};

export default LoginForm;