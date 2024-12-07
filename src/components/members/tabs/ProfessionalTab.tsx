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

  const professionalStatus = user.professional_status?.[0] || "-";

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">Situation professionnelle</p>
      <p>{professionalStatus}</p>
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
      <p className="text-muted-foreground">Justificatif professionnel</p>
      <p>
        {user.professional_document_url ? (
          <a 
            href={user.professional_document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Télécharger le justificatif
          </a>
        ) : (
          "-"
        )}
      </p>
    </div>
  );
};