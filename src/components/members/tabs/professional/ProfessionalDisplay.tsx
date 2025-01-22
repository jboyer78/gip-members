import { Profile } from "@/integrations/supabase/types/profile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface ProfessionalDisplayProps {
  user: Profile;
}

export const ProfessionalDisplay = ({ user }: ProfessionalDisplayProps) => {
  const { t } = useTranslation();
  
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  const professionalStatus = user.professional_status?.[0] || "-";

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">{t('profile.professionalStatus')}</p>
      <p>{professionalStatus}</p>
      <p className="text-muted-foreground">{t('profile.administration')}</p>
      <p>{user.administration || "-"}</p>
      <p className="text-muted-foreground">{t('profile.administrationEntryDate')}</p>
      <p>{formatDate(user.administration_entry_date)}</p>
      <p className="text-muted-foreground">{t('profile.trainingSite')}</p>
      <p>{user.training_site || "-"}</p>
      <p className="text-muted-foreground">{t('profile.grade')}</p>
      <p>{user.grade || "-"}</p>
      <p className="text-muted-foreground">{t('profile.direction')}</p>
      <p>{user.assignment_direction || "-"}</p>
      <p className="text-muted-foreground">{t('profile.service')}</p>
      <p>{user.assignment_service || "-"}</p>
      <p className="text-muted-foreground">{t('profile.professionalDocument')}</p>
      <p>
        {user.professional_document_url ? (
          <a 
            href={user.professional_document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t('profile.downloadDocument')}
          </a>
        ) : (
          "-"
        )}
      </p>
    </div>
  );
};