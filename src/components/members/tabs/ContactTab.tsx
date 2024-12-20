import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./contact/ContactForm";
import { ContactDisplay } from "./contact/ContactDisplay";

interface ContactTabProps {
  user: Profile;
  onUpdate?: (updatedProfile: Profile) => void;
}

export const ContactTab = ({ user, onUpdate }: ContactTabProps) => {
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
        <ContactDisplay user={user} />
        <Button onClick={() => setIsEditing(true)} className="w-full">
          Modifier les coordonnées
        </Button>
      </div>
    );
  }

  return (
    <ContactForm 
      user={user} 
      onCancel={() => setIsEditing(false)}
      onSuccess={handleSuccess}
    />
  );
};