import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

export const EmailInput = ({ email, setEmail }: EmailInputProps) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Label htmlFor="email">{t('auth.email')}</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1"
        placeholder="exemple@email.com"
      />
    </div>
  );
};