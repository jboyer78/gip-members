import { Profile } from "@/integrations/supabase/types/profile";
import { useTranslation } from "react-i18next";

interface ContactDisplayProps {
  user: Profile;
}

export const ContactDisplay = ({ user }: ContactDisplayProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">{t('profile.address')}</p>
      <p>{user.street || "-"}</p>
      <p className="text-muted-foreground">{t('profile.postalCode')}</p>
      <p>{user.postal_code || "-"}</p>
      <p className="text-muted-foreground">{t('profile.city')}</p>
      <p>{user.city || "-"}</p>
      <p className="text-muted-foreground">{t('profile.country')}</p>
      <p>{user.country || "-"}</p>
      <p className="text-muted-foreground">{t('profile.phoneHome')}</p>
      <p>{user.phone_home || "-"}</p>
      <p className="text-muted-foreground">{t('profile.phoneMobile')}</p>
      <p>{user.phone_mobile || "-"}</p>
    </div>
  );
};