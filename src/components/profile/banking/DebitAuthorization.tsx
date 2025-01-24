import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { BankingFormValues } from "./types";

interface DebitAuthorizationProps {
  form: UseFormReturn<BankingFormValues>;
}

export const DebitAuthorization = ({ form }: DebitAuthorizationProps) => {
  return (
    <FormField
      control={form.control}
      name="authorize_debit"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm">
              J'autorise GROUPE INTERNATIONAL POLICE à prélever sur mon compte bancaire le montant de la cotisation annuelle
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};