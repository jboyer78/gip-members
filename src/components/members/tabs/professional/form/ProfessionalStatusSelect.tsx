import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { professionalStatuses } from "../constants";

interface ProfessionalStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ProfessionalStatusSelect = ({ value, onChange, disabled }: ProfessionalStatusSelectProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sélectionnez votre situation" />
      </SelectTrigger>
      <SelectContent>
        {professionalStatuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};