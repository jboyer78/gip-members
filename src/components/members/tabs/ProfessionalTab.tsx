import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfessionalForm } from "./professional/ProfessionalForm";
import { ProfessionalDisplay } from "./professional/ProfessionalDisplay";

interface ProfessionalTabProps {
  user: Profile;
  onUpdate?: (updatedProfile: Profile) => void;
}

export const ProfessionalTab = ({ user, onUpdate }: ProfessionalTabProps) => {
  const [isEditing, setIsEditing] = useState(false);

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
          Modifier les informations professionnelles
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