import { Profile } from "@/integrations/supabase/types/profile";

interface ContactTabProps {
  user: Profile;
}

export const ContactTab = ({ user }: ContactTabProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">Adresse</p>
      <p>{user.street || "-"}</p>
      <p className="text-muted-foreground">Code postal</p>
      <p>{user.postal_code || "-"}</p>
      <p className="text-muted-foreground">Ville</p>
      <p>{user.city || "-"}</p>
      <p className="text-muted-foreground">Pays</p>
      <p>{user.country || "-"}</p>
      <p className="text-muted-foreground">Téléphone fixe</p>
      <p>{user.phone_home || "-"}</p>
      <p className="text-muted-foreground">Téléphone mobile</p>
      <p>{user.phone_mobile || "-"}</p>
    </div>
  );
};