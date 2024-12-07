import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  allLabel: string;
}

export const SelectFilter = ({ value, onChange, placeholder, options, allLabel }: SelectFilterProps) => {
  // Filter out any empty strings, null, or undefined values
  const validOptions = options.filter(option => option && option.trim() !== "");

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {validOptions.map((option) => (
          <SelectItem key={option} value={option}>{option}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};