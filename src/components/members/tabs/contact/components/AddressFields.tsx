import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "../constants/countries";

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
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="street">Adresse</Label>
        <Input
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postal_code">Code postal</Label>
        <Input
          id="postal_code"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Pays</Label>
        <Select value={formData.country} onValueChange={handleCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un pays" />
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