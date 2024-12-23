import { Profile } from "@/integrations/supabase/types/profile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BankingTabProps {
  user: Profile;
}

export const BankingTab = ({ user }: BankingTabProps) => {
  const { data: bankingInfo, isLoading } = useQuery({
    queryKey: ['bankingInfo', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banking_info')
        .select('*')
        .eq('profile_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Chargement des informations bancaires...</p>;
  }

  if (!bankingInfo) {
    return <p className="text-muted-foreground">Aucune information bancaire disponible</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-muted-foreground">IBAN</p>
      <p>{bankingInfo.iban || "-"}</p>
      <p className="text-muted-foreground">BIC</p>
      <p>{bankingInfo.bic || "-"}</p>
      <p className="text-muted-foreground">Prélèvement automatique</p>
      <p>{bankingInfo.authorize_debit ? "Autorisé" : "Non autorisé"}</p>
    </div>
  );
};