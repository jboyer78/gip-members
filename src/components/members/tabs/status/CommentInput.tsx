import { Textarea } from "@/components/ui/textarea";

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const CommentInput = ({ value, onChange }: CommentInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Commentaire</label>
      <Textarea
        placeholder="Ajouter un commentaire concernant le changement de statut..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};