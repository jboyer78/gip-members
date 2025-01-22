import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface PhoneFieldsProps {
  formData: {
    phone_home: string;
    phone_mobile: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneFields = ({ formData, handleChange }: PhoneFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone_home">{t('profile.phoneHome')}</Label>
        <Input
          id="phone_home"
          name="phone_home"
          type="tel"
          value={formData.phone_home}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_mobile">{t('profile.phoneMobile')}</Label>
        <Input
          id="phone_mobile"
          name="phone_mobile"
          type="tel"
          value={formData.phone_mobile}
          onChange={handleChange}
        />
      </div>
    </>
  );
};