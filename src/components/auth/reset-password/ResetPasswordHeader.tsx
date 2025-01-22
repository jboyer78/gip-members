import { useTranslation } from "react-i18next";

const ResetPasswordHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        {t("auth.resetPassword.title")}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {t("auth.resetPassword.subtitle")}
      </p>
    </div>
  );
};

export default ResetPasswordHeader;