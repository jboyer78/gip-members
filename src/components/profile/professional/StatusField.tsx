import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";

const statusOptions = [
  { id: "en_attente", label: "En attente" },
  { id: "validee", label: "Validée" },
  { id: "refusee", label: "Refusée" }
];

interface StatusFieldProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StatusField = ({ form }: StatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Situation</FormLabel>
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
              {statusOptions.map((option) => (
                <SelectItem key={option.id} value={option.label}>
                  {option.label}
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