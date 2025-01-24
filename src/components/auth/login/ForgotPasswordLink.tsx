import { useNavigate } from "react-router-dom";

export const ForgotPasswordLink = () => {
  const navigate = useNavigate();
  
  return (
    <button
      type="button"
      onClick={() => navigate("/reset-password")}
      className="text-sm text-primary hover:underline"
    >
      Mot de passe oublié ?
    </button>
  );
};