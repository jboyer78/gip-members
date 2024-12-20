import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CreateMemberFormFields } from "./CreateMemberFormFields";
import { CreateMemberFormActions } from "./CreateMemberFormActions";
import { validateEmail, validatePassword } from "@/utils/validation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export interface CreateMemberFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface CreateMemberFormProps {
  onSuccess: () => void;
}

export const CreateMemberForm = ({ onSuccess }: CreateMemberFormProps) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CreateMemberFormValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      birthDate: "",
    },
  });

  const onSubmit = async (values: CreateMemberFormValues) => {
    try {
      setLoading(true);

      // Validate email
      const emailValidation = validateEmail(values.email);
      if (!emailValidation.isValid) {
        toast.error(emailValidation.message);
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
      }

      // Call the Edge Function using Supabase client
      const { error } = await supabase.functions.invoke('create-member', {
        body: values
      });

      if (error) {
        throw error;
      }

      toast.success("Membre créé avec succès");
      form.reset();
      onSuccess();
      
      // Invalider le cache pour forcer le rechargement du tableau
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['profiles-with-banking'] });
    } catch (error) {
      console.error("Error in member creation:", error);
      toast.error("Une erreur est survenue lors de la création du membre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CreateMemberFormFields form={form} />
        <CreateMemberFormActions loading={loading} />
      </form>
    </Form>
  );
};