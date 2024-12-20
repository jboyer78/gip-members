import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const StatusSelector = ({ value, onChange }: StatusSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Nouveau statut</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="En attente">En attente</SelectItem>
          <SelectItem value="Validée">Validée</SelectItem>
          <SelectItem value="Refusée">Refusée</SelectItem>
          <SelectItem value="Suspendue">Suspendue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};