import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { BankingDisplay } from "./banking/BankingDisplay";
import { BankingForm } from "./banking/BankingForm";
import { useTranslation } from "react-i18next";

interface BankingTabProps {
  user: Profile;
}

export const BankingTab = ({ user }: BankingTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const handleSuccess = async () => {
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <BankingDisplay bankingInfo={user.banking_info} />
        <Button onClick={() => setIsEditing(true)} className="w-full">
          {user.banking_info ? t('profile.editBankingInfo') : t('profile.addBankingInfo')}
        </Button>
      </div>
    );
  }

  return (
    <BankingForm 
      bankingInfo={user.banking_info}
      profileId={user.id}
      onCancel={() => setIsEditing(false)}
      onSuccess={handleSuccess}
    />
  );
};