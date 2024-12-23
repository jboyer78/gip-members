import { Button } from "@/components/ui/button";

interface BankingFormActionsProps {
  onCancel: () => void;
}

export const BankingFormActions = ({ onCancel }: BankingFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit">
        Enregistrer
      </Button>
    </div>
  );
};