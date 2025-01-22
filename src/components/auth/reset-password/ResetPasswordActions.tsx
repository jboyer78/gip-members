import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ResetPasswordActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const ResetPasswordActions = ({ isLoading, onCancel }: ResetPasswordActionsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? t("auth.resetPassword.sending") : t("auth.resetPassword.sendLink")}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onCancel}
        disabled={isLoading}
      >
        {t("auth.resetPassword.backToLogin")}
      </Button>
    </div>
  );
};

export default ResetPasswordActions;