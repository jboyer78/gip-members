import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CreateMemberFormFields } from "./CreateMemberFormFields";
import { CreateMemberFormActions } from "./CreateMemberFormActions";
import { validateEmail } from "@/utils/validation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { generateSecurePassword } from "@/utils/passwordGenerator";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface CreateMemberFormValues {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface CreateMemberFormProps {
  onSuccess: () => void;
}

export const CreateMemberForm = ({ onSuccess }: CreateMemberFormProps) => {
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const queryClient = useQueryClient();

  const form = useForm<CreateMemberFormValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
    },
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      toast.success("Mot de passe copié dans le presse-papier");
    } catch (err) {
      toast.error("Erreur lors de la copie du mot de passe");
    }
  };

  const handleClose = () => {
    setGeneratedPassword("");
    form.reset();
    onSuccess();
  };

  const onSubmit = async (values: CreateMemberFormValues) => {
    try {
      setLoading(true);

      // Validate email
      const emailValidation = validateEmail(values.email);
      if (!emailValidation.isValid) {
        toast.error(emailValidation.message);
        return;
      }

      // Check if email already exists in profiles table
      const { data: existingProfile, error: searchError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', values.email)
        .maybeSingle();

      if (searchError) {
        console.error("Error checking existing profile:", searchError);
        toast.error("Erreur lors de la vérification de l'email");
        return;
      }

      if (existingProfile) {
        toast.error("Un utilisateur existe déjà avec cette adresse email");
        return;
      }

      // Generate a secure password
      const password = generateSecurePassword();

      // Call the Edge Function using Supabase client
      const { data, error } = await supabase.functions.invoke('create-member', {
        body: {
          ...values,
          password
        }
      });

      if (error) {
        console.error("Error from create-member function:", error);
        toast.error("Une erreur est survenue lors de la création du membre");
        return;
      }

      // Si la réponse contient une erreur spécifique
      if (data?.error) {
        console.error("Error from create-member function:", data.error);
        toast.error(data.error);
        return;
      }

      setGeneratedPassword(password);
      toast.success("Membre créé avec succès");
      
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
        
        {generatedPassword ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="generatedPassword">Mot de passe généré</Label>
              <div className="flex gap-2">
                <Input
                  id="generatedPassword"
                  value={generatedPassword}
                  readOnly
                  className="bg-green-50 dark:bg-green-900/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
              >
                Fermer
              </Button>
            </div>
          </>
        ) : (
          <CreateMemberFormActions loading={loading} />
        )}
      </form>
    </Form>
  );
};