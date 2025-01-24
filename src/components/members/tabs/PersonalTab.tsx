import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { PersonalForm } from "./personal/PersonalForm";
import { PersonalDisplay } from "./personal/PersonalDisplay";

interface PersonalTabProps {
  user: Profile;
  onUpdate?: (updatedProfile: Profile) => void;
}

export const PersonalTab = ({ user, onUpdate }: PersonalTabProps) => {
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
        <PersonalDisplay user={user} />
        <Button onClick={() => setIsEditing(true)} className="w-full">
          Modifier les informations personnelles
        </Button>
      </div>
    );
  }

  return (
    <PersonalForm 
      user={user} 
      onCancel={() => setIsEditing(false)}
      onSuccess={handleSuccess}
    />
  );
};