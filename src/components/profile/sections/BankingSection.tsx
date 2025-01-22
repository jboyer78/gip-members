import { Card, CardContent } from "@/components/ui/card";
import { BankingInfoCard } from "../BankingInfoCard";
import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const BankingSection = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{t('profile.bankingInfo')}</h2>
        </div>
        <BankingInfoCard />
      </CardContent>
    </Card>
  );
};