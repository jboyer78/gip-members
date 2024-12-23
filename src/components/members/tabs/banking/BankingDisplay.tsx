import { BankingInfo } from "@/integrations/supabase/types/banking";

interface BankingDisplayProps {
  bankingInfo: BankingInfo | null;
}

export const BankingDisplay = ({ bankingInfo }: BankingDisplayProps) => {
  if (!bankingInfo || !bankingInfo.iban) {
    return (
      <p className="text-muted-foreground">
        Aucune information bancaire disponible
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">IBAN</p>
        <p className="mt-1">{bankingInfo.iban}</p>
      </div>
      
      <div>
        <p className="text-sm font-medium text-muted-foreground">BIC</p>
        <p className="mt-1">{bankingInfo.bic || "-"}</p>
      </div>
      
      <div className="col-span-2">
        <p className="text-sm font-medium text-muted-foreground">Prélèvement automatique</p>
        <p className="mt-1">{bankingInfo.authorize_debit ? "Autorisé" : "Non autorisé"}</p>
      </div>
    </div>
  );
};