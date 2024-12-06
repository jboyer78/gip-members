import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
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

const statusOptions = [
  { id: "actif", label: "Actif" },
  { id: "retraite", label: "Retraité(e)" },
  { id: "sympathisant", label: "Sympathisant" },
  { id: "eleve", label: "Élève" }
];

interface ProfessionalFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ProfessionalFields = ({ form }: ProfessionalFieldsProps) => {
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

      <FormField
        control={form.control}
        name="training_site"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site de formation</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="grade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assignment_direction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Direction d'affectation</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assignment_service"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service d'affectation</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={() => (
          <FormItem>
            <FormLabel>Situation</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {statusOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.label)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, option.label]);
                              } else {
                                field.onChange(
                                  currentValue.filter((value) => value !== option.label)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};