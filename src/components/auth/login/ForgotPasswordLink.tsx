import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const ForgotPasswordLink = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <button
      type="button"
      onClick={() => navigate("/reset-password")}
      className="text-sm text-primary hover:underline"
    >
      {t('auth.forgotPassword')}
    </button>
  );
};