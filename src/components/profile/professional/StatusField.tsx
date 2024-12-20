import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";

const statusOptions = [
  "Actif",
  "Retraité(e)",
  "Élève",
  "Membre fondateur",
  "Membre d'honneur"
].sort();

interface StatusFieldProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StatusField = ({ form }: StatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="professional_status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Situation professionnelle</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange([value])} 
            value={field.value?.[0] || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre situation" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};