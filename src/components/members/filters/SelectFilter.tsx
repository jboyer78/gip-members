import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  allLabel: string;
}

export const SelectFilter = ({ value, onChange, placeholder, options, allLabel }: SelectFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>{option}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};