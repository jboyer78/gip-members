import { Button } from "@/components/ui/button";

interface ResetPasswordActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const ResetPasswordActions = ({ isLoading, onCancel }: ResetPasswordActionsProps) => (
  <div className="space-y-4">
    <Button 
      type="submit" 
      className="w-full" 
      disabled={isLoading}
    >
      {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
    </Button>
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onCancel}
      disabled={isLoading}
    >
      Retour à la connexion
    </Button>
  </div>
);

export default ResetPasswordActions;