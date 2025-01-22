import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

export const PasswordInput = ({ password, setPassword }: PasswordInputProps) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Label htmlFor="password">{t('auth.password')}</Label>
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-1"
      />
    </div>
  );
};