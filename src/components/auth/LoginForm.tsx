import { useState } from "react";
import { UsernameInput } from "./login/EmailInput";
import { PasswordInput } from "./login/PasswordInput";
import { RememberMeCheckbox } from "./login/RememberMeCheckbox";
import { ForgotPasswordLink } from "./login/ForgotPasswordLink";
import { SubmitButton } from "./login/SubmitButton";
import { useLoginSubmit } from "./login/useLoginSubmit";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const { handleSubmit, loading } = useLoginSubmit();

  return (
    <form onSubmit={(e) => handleSubmit(e, { username, password })} className="mt-8 space-y-6">
      <div className="space-y-4">
        <UsernameInput username={username} setUsername={setUsername} />
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