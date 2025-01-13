import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { administrations } from "../constants";

interface AdministrationSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AdministrationSelect = ({ value, onChange, disabled }: AdministrationSelectProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sélectionnez votre administration" />
      </SelectTrigger>
      <SelectContent>
        {administrations.map((admin) => (
          <SelectItem key={admin} value={admin}>
            {admin}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};