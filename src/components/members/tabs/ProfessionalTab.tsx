import { Profile } from "@/integrations/supabase/types/profile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProfessionalTabProps {
  user: Profile;
}

export const ProfessionalTab = ({ user }: ProfessionalTabProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  // Filter out registration status and keep only professional status
  const professionalStatus = user.status?.find(status => 
    ["Actif", "Retraité(e)", "Sympathisant", "Élève"].includes(status)
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">Statut professionnel</p>
      <p>{professionalStatus || "-"}</p>
      <p className="text-muted-foreground">Administration</p>
      <p>{user.administration || "-"}</p>
      <p className="text-muted-foreground">Date d'entrée</p>
      <p>{formatDate(user.administration_entry_date)}</p>
      <p className="text-muted-foreground">Site de formation</p>
      <p>{user.training_site || "-"}</p>
      <p className="text-muted-foreground">Grade</p>
      <p>{user.grade || "-"}</p>
      <p className="text-muted-foreground">Direction</p>
      <p>{user.assignment_direction || "-"}</p>
      <p className="text-muted-foreground">Service</p>
      <p>{user.assignment_service || "-"}</p>
    </div>
  );
};
