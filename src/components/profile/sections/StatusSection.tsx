import { Card, CardContent } from "@/components/ui/card";
import { EmailCard } from "../EmailCard";
import { StatusCard } from "../StatusCard";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../types";
import { UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatusSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const StatusSection = ({ form }: StatusSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{t('profile.accountStatus')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmailCard form={form} />
          <StatusCard />
        </div>
      </CardContent>
    </Card>
  );
};