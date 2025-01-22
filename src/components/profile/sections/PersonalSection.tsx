import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "../ProfileFormFields";
import { UserRound } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../types";
import { useTranslation } from "react-i18next";

interface PersonalSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
}

export const PersonalSection = ({ form, onSubmit }: PersonalSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserRound className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{t('profile.personalInfo')}</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProfileFormFields form={form} />
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {t('profile.saveChanges')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};