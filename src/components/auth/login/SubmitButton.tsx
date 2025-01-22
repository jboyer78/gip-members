import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  const { t } = useTranslation();
  
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? t('common.loading') : t('auth.loginButton')}
    </Button>
  );
};