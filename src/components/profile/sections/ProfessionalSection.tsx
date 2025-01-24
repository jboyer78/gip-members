import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProfessionalFields } from "../ProfessionalFields";
import { UserCog } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";

interface ProfessionalSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
  onSubmit: (values: ProfessionalFormValues) => Promise<void>;
}

export const ProfessionalSection = ({ form, onSubmit }: ProfessionalSectionProps) => {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCog className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Informations professionnelles</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfessionalFields form={form} />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Enregistrer les modifications
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};