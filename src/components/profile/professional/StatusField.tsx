import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";

const statusOptions = [
  { id: "actif", label: "Actif" },
  { id: "retraite", label: "Retraité(e)" },
  { id: "sympathisant", label: "Sympathisant" },
  { id: "eleve", label: "Élève" }
];

interface StatusFieldProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StatusField = ({ form }: StatusFieldProps) => {
  const currentStatus = form.watch("status") || [];

  return (
    <FormField
      control={form.control}
      name="status"
      render={() => (
        <FormItem>
          <FormLabel>Situation professionnelle</FormLabel>
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
                            const updatedStatus = checked
                              ? [...currentStatus, option.label]
                              : currentStatus.filter((value) => value !== option.label);
                            field.onChange(updatedStatus);
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
  );
};