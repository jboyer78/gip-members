import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";

interface AssignmentFieldsProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const AssignmentFields = ({ form }: AssignmentFieldsProps) => {
  return (
    <>
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
    </>
  );
};