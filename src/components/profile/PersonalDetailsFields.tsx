import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";

const maritalStatusOptions = [
  "Marié(e)",
  "Divorcé(e)",
  "Veuf(ve)",
  "Célibataire",
  "Autres"
];

interface PersonalDetailsFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const PersonalDetailsFields = ({ form }: PersonalDetailsFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="birth_city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ville de naissance</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birth_department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Département de naissance</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="blood_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Groupe sanguin</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="marital_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situation matrimoniale</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre situation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {maritalStatusOptions.map((status) => (
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

      <FormField
        control={form.control}
        name="children_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre d'enfants</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};