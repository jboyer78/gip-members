import { useState } from "react";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { ForgotPasswordLink } from "./ForgotPasswordLink";
import { SubmitButton } from "./SubmitButton";
import { useLoginSubmit } from "./useLoginSubmit";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const { handleSubmit, loading } = useLoginSubmit();

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