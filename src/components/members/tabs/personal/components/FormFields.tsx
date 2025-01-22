import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodTypeOptions, maritalStatusOptions, bloodTypeMapping } from "../constants";
import { useTranslation } from "react-i18next";

interface FormFieldsProps {
  formData: {
    birth_date: string;
    birth_city: string;
    birth_department: string;
    blood_type: string;
    marital_status: string;
    children_count: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const FormFields = ({ formData, handleChange, handleSelectChange }: FormFieldsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="birth_date">{t('profile.birthDate')}</Label>
        <Input
          id="birth_date"
          name="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_city">{t('profile.birthCity')}</Label>
        <Input
          id="birth_city"
          name="birth_city"
          value={formData.birth_city}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_department">{t('profile.birthDepartment')}</Label>
        <Input
          id="birth_department"
          name="birth_department"
          value={formData.birth_department}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blood_type">{t('profile.bloodType')}</Label>
        <Select 
          value={formData.blood_type} 
          onValueChange={(value) => handleSelectChange("blood_type", bloodTypeMapping[value] || value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('profile.selectBloodType')} />
          </SelectTrigger>
          <SelectContent>
            {bloodTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="marital_status">{t('profile.maritalStatus')}</Label>
        <Select 
          value={formData.marital_status} 
          onValueChange={(value) => handleSelectChange("marital_status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('profile.selectMaritalStatus')} />
          </SelectTrigger>
          <SelectContent>
            {maritalStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="children_count">{t('profile.childrenCount')}</Label>
        <Input
          id="children_count"
          name="children_count"
          type="number"
          min="0"
          value={formData.children_count}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};