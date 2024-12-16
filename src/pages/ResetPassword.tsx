import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Erreur lors de la réinitialisation:", error);
        throw error;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe",
      });
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email de réinitialisation. Veuillez réessayer plus tard.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Réinitialisation du mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="reset-email">Adresse email</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              required
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              Retour à la connexion
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;