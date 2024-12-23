import { BankingInfo } from "@/integrations/supabase/types/banking";

interface BankingDisplayProps {
  bankingInfo: BankingInfo | null;
}

export const BankingDisplay = ({ bankingInfo }: BankingDisplayProps) => {
  if (!bankingInfo) {
    return (
      <p className="text-muted-foreground">
        Aucune information bancaire disponible
      </p>
    );
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