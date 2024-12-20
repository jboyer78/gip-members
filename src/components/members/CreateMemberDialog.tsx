import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail, validatePassword } from "@/utils/validation";
import { UserPlus } from "lucide-react";

interface CreateMemberFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

export const CreateMemberDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
      });

      if (authError) {
        console.error("Error creating auth user:", authError);
        toast.error("Erreur lors de la création du compte");
        return;
      }

      if (!authData.user) {
        toast.error("Erreur lors de la création du compte");
        return;
      }

      // Update profile with additional information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          birth_date: values.birthDate,
          email_verified: true,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        toast.error("Erreur lors de la mise à jour du profil");
        return;
      }

      toast.success("Membre créé avec succès");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error in member creation:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau membre</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="exemple@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de naissance</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création en cours..." : "Créer le membre"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};