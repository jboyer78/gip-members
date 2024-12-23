import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BankingDisplay } from "./banking/BankingDisplay";
import { BankingForm } from "./banking/BankingForm";

interface BankingTabProps {
  user: Profile;
}

export const BankingTab = ({ user }: BankingTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: bankingInfo, isLoading, refetch } = useQuery({
    queryKey: ['bankingInfo', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banking_info')
        .select('*')
        .eq('profile_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const handleSuccess = async () => {
    setIsEditing(false);
    await refetch();
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Chargement des informations bancaires...</p>;
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <BankingDisplay bankingInfo={bankingInfo} />
        <Button onClick={() => setIsEditing(true)} className="w-full">
          {bankingInfo ? "Modifier les informations bancaires" : "Ajouter des informations bancaires"}
        </Button>
      </div>
    );
  }

  return (
    <BankingForm 
      bankingInfo={bankingInfo}
      profileId={user.id}
      onCancel={() => setIsEditing(false)}
      onSuccess={handleSuccess}
    />
  );
};