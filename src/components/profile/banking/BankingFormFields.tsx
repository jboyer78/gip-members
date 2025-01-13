import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BankingFormValues } from "./types";

interface BankingFormFieldsProps {
  form: UseFormReturn<BankingFormValues>;
}

export const BankingFormFields = ({ form }: BankingFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="iban"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IBAN</FormLabel>
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
            <FormLabel>BIC</FormLabel>
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