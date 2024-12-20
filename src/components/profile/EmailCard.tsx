import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";

interface EmailCardProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const EmailCard = ({ form }: EmailCardProps) => {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Adresse email</h2>
        <div className="w-full space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {form.getValues("email")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Si vous souhaitez modifier votre email veuillez contacter le support au 06 37 73 68 98
          </p>
        </div>
      </CardContent>
    </Card>
  );
};