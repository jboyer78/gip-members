import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";
import { format } from "date-fns";

const administrations = [
  "Police Nationale",
  "Police Municipale",
  "Gendarmerie Nationale",
  "Police des transports",
  "Douane",
  "Police de l'environnement",
  "autres"
];

interface AdministrationFieldsProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const AdministrationFields = ({ form }: AdministrationFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="administration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Administration</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre administration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {administrations.map((admin) => (
                  <SelectItem key={admin} value={admin}>
                    {admin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="administration_entry_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date d'entrée dans l'administration</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};