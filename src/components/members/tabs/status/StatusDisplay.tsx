import { Profile } from "@/integrations/supabase/types/profile";

interface StatusDisplayProps {
  currentStatus: string | undefined;
}

export const StatusDisplay = ({ currentStatus }: StatusDisplayProps) => {
  const displayStatus = !currentStatus || currentStatus === "Sympathisant" ? "En attente de validation" : currentStatus;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Statut actuel</label>
      <p className="text-lg font-semibold">{displayStatus}</p>
    </div>
  );
};