import { Button } from "@/components/ui/button";

interface EditPublicationFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const EditPublicationFormActions = ({ 
  isSubmitting, 
  onCancel 
}: EditPublicationFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Modification..." : "Modifier"}
      </Button>
    </div>
  );
};