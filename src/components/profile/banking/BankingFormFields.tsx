import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BankingFormValues } from "./types";
import { useTranslation } from "react-i18next";

interface BankingFormFieldsProps {
  form: UseFormReturn<BankingFormValues>;
}

export const BankingFormFields = ({ form }: BankingFormFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="iban"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('profile.iban')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('profile.bic')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="BNPAFRPPXXX" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};