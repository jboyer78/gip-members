import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PhoneFieldsProps {
  formData: {
    phone_home: string;
    phone_mobile: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneFields = ({ formData, handleChange }: PhoneFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone_home">Téléphone fixe</Label>
        <Input
          id="phone_home"
          name="phone_home"
          type="tel"
          value={formData.phone_home}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_mobile">Téléphone mobile</Label>
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