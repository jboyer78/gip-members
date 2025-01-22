import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BankingFormFields } from "./BankingFormFields";
import { DebitAuthorization } from "./DebitAuthorization";
import { useBankingForm } from "./useBankingForm";
import { useTranslation } from "react-i18next";

export const BankingForm = () => {
  const { form, onSubmit, isLoading } = useBankingForm();
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BankingFormFields form={form} />
        <DebitAuthorization form={form} />
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? t('profile.saving') : t('profile.saveChanges')}
        </Button>
      </form>
    </Form>
  );
};