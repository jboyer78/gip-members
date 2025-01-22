import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { ProfessionalForm } from "./professional/ProfessionalForm";
import { ProfessionalDisplay } from "./professional/ProfessionalDisplay";
import { useTranslation } from "react-i18next";

interface ProfessionalTabProps {
  user: Profile;
  onUpdate?: (updatedProfile: Profile) => void;
}

export const ProfessionalTab = ({ user, onUpdate }: ProfessionalTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const handleSuccess = (updatedProfile: Profile) => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(updatedProfile);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <ProfessionalDisplay user={user} />
        <Button onClick={() => setIsEditing(true)} className="w-full">
          {t('profile.editProfessionalInfo')}
        </Button>
      </div>
    );
  }

  return (
    <ProfessionalForm 
      user={user} 
      onCancel={() => setIsEditing(false)}
      onSuccess={handleSuccess}
    />
  );
};