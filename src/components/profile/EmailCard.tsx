import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { useTranslation } from "react-i18next";

interface EmailCardProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const EmailCard = ({ form }: EmailCardProps) => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('profile.email')}</h2>
        <div className="w-full space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {form.getValues("email")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('profile.emailChangeInstructions')}
          </p>
          <Button 
            onClick={() => setIsChangePasswordOpen(true)}
            variant="outline"
            className="w-full"
          >
            Modifier le mot de passe
          </Button>
        </div>
      </CardContent>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modification du mot de passe</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm onSuccess={() => setIsChangePasswordOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};