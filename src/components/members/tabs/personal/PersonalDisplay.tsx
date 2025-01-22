import { Profile } from "@/integrations/supabase/types/profile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface PersonalDisplayProps {
  user: Profile;
}

export const PersonalDisplay = ({ user }: PersonalDisplayProps) => {
  const { t, i18n } = useTranslation();
  
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { 
      locale: i18n.language === 'fr' ? fr : undefined 
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">{t('profile.email')}</p>
      <p>{user.email || "-"}</p>
      <p className="text-muted-foreground">{t('profile.birthDate')}</p>
      <p>{formatDate(user.birth_date)}</p>
      <p className="text-muted-foreground">{t('profile.birthCity')}</p>
      <p>{user.birth_city || "-"}</p>
      <p className="text-muted-foreground">{t('profile.birthDepartment')}</p>
      <p>{user.birth_department || "-"}</p>
      <p className="text-muted-foreground">{t('profile.bloodType')}</p>
      <p>{user.blood_type || "-"}</p>
      <p className="text-muted-foreground">{t('profile.maritalStatus')}</p>
      <p>{user.marital_status || "-"}</p>
      <p className="text-muted-foreground">{t('profile.childrenCount')}</p>
      <p>{user.children_count !== null ? user.children_count : "-"}</p>
    </div>
  );
};