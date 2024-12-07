import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchFilter = ({ value, onChange }: SearchFilterProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <Input
        type="search"
        placeholder="Rechercher un membre..."
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};