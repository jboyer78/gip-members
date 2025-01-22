import { BankingInfo } from "@/integrations/supabase/types/banking";
import { useTranslation } from "react-i18next";

interface BankingDisplayProps {
  bankingInfo: BankingInfo | null;
}

export const BankingDisplay = ({ bankingInfo }: BankingDisplayProps) => {
  const { t } = useTranslation();

  if (!bankingInfo || !bankingInfo.iban) {
    return (
      <p className="text-muted-foreground">
        {t('profile.noBankingInfo')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{t('profile.iban')}</p>
        <p className="mt-1">{bankingInfo.iban}</p>
      </div>
      
      <div>
        <p className="text-sm font-medium text-muted-foreground">{t('profile.bic')}</p>
        <p className="mt-1">{bankingInfo.bic || "-"}</p>
      </div>
      
      <div className="col-span-2">
        <p className="text-sm font-medium text-muted-foreground">{t('profile.automaticDebit')}</p>
        <p className="mt-1">{bankingInfo.authorize_debit ? t('profile.authorized') : t('profile.notAuthorized')}</p>
      </div>
    </div>
  );
};