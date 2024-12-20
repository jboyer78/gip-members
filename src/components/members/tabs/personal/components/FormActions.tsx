import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
}

export const FormActions = ({ onCancel }: FormActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button type="submit" className="flex-1">
        Enregistrer
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="flex-1"
      >
        Annuler
      </Button>
    </div>
  );
};