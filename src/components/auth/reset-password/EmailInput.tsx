import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  onChange: (value: string) => void;
}

const EmailInput = ({ email, onChange }: EmailInputProps) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Label htmlFor="reset-email">{t("auth.resetPassword.emailLabel")}</Label>
      <Input
        id="reset-email"
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("auth.resetPassword.emailPlaceholder")}
        required
        className="mt-1"
      />
    </div>
  );
};

export default EmailInput;