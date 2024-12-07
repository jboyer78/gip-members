import { Profile } from "@/integrations/supabase/types/profile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PersonalTabProps {
  user: Profile;
}

export const PersonalTab = ({ user }: PersonalTabProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">Email</p>
      <p>{user.email || "-"}</p>
      <p className="text-muted-foreground">Date de naissance</p>
      <p>{formatDate(user.birth_date)}</p>
      <p className="text-muted-foreground">Ville de naissance</p>
      <p>{user.birth_city || "-"}</p>
      <p className="text-muted-foreground">Département</p>
      <p>{user.birth_department || "-"}</p>
      <p className="text-muted-foreground">Groupe sanguin</p>
      <p>{user.blood_type || "-"}</p>
      <p className="text-muted-foreground">Situation familiale</p>
      <p>{user.marital_status || "-"}</p>
      <p className="text-muted-foreground">Nombre d'enfants</p>
      <p>{user.children_count !== null ? user.children_count : "-"}</p>
    </div>
  );
};