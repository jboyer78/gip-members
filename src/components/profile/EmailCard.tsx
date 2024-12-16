import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EmailCardProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const EmailCard = ({ form }: EmailCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpdateEmail = async () => {
    const { error } = await supabase.auth.updateUser({
      email: form.getValues("email")
    });

    if (error) {
      console.error('Error updating email:', error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'adresse email",
      });
    } else {
      toast({
        title: "Succès",
        description: "Un email de confirmation vous a été envoyé",
      });
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Si pas de session, on redirige vers la page de login
        toast({
          variant: "destructive",
          title: "Session expirée",
          description: "Veuillez vous reconnecter pour modifier votre mot de passe",
        });
        navigate("/login");
        return;
      }

      // Si session valide, on envoie l'email de réinitialisation
      const { error } = await supabase.auth.resetPasswordForEmail(
        form.getValues("email"),
        {
          redirectTo: `${window.location.origin}/change-password`,
        }
      );
      
      if (error) {
        console.error('Error resetting password:', error.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'initier la réinitialisation du mot de passe",
        });
      } else {
        toast({
          title: "Succès",
          description: "Un email de réinitialisation vous a été envoyé",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation du mot de passe",
      });
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Adresse email</h2>
        <div className="w-full">
          <input
            type="email"
            value={form.getValues("email")}
            readOnly
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300"
          />
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Button 
              type="button"
              onClick={handleUpdateEmail}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Modifier l'email
            </Button>
            <Button 
              type="button"
              onClick={handleUpdatePassword}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Modifier le mot de passe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};