import { Button } from "@/components/ui/button";

interface CreateMemberFormActionsProps {
  loading: boolean;
}

export const CreateMemberFormActions = ({ loading }: CreateMemberFormActionsProps) => {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Création en cours..." : "Créer le membre"}
    </Button>
  );
};