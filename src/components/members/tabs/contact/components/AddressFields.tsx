import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "../constants/countries";
import { useTranslation } from "react-i18next";

interface AddressFieldsProps {
  formData: {
    street: string;
    postal_code: string;
    city: string;
    country: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryChange: (value: string) => void;
}

export const AddressFields = ({ formData, handleChange, handleCountryChange }: AddressFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="street">{t('profile.address')}</Label>
        <Input
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postal_code">{t('profile.postalCode')}</Label>
        <Input
          id="postal_code"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">{t('profile.city')}</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">{t('profile.country')}</Label>
        <Select value={formData.country} onValueChange={handleCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('profile.selectStatus')} />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};