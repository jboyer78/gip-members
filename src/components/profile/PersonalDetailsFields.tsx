import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { format } from "date-fns";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Inconnu"];
const maritalStatuses = ["Marié(e)", "Divorcé(e)", "Veuf(ve)", "Célibataire"];
const childrenCounts = Array.from({ length: 11 }, (_, i) => i.toString());

interface PersonalDetailsFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const PersonalDetailsFields = ({ form }: PersonalDetailsFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="birth_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de naissance</FormLabel>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre groupe sanguin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
        name="marital_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situation familiale</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre situation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {maritalStatuses.map((status) => (
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
            <Select 
              onValueChange={(value) => field.onChange(parseInt(value))} 
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le nombre" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {childrenCounts.map((count) => (
                  <SelectItem key={count} value={count}>
                    {count}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};