import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface RememberMeCheckboxProps {
  rememberMe: boolean;
  setRememberMe: (checked: boolean) => void;
}

export const RememberMeCheckbox = ({ rememberMe, setRememberMe }: RememberMeCheckboxProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={rememberMe}
        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
      />
      <Label htmlFor="remember" className="text-sm">
        {t('auth.rememberMe')}
      </Label>
    </div>
  );
};