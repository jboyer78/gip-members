import { toast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export const handleAuthError = (error: AuthError, toastFn = toast) => {
  console.error('Auth error:', error);

  switch (error.message) {
    case 'Invalid login credentials':
      toastFn({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Email ou mot de passe incorrect",
      });
      break;
    case 'Email not confirmed':
      toastFn({
        variant: "destructive",
        title: "Email non confirmé",
        description: "Veuillez confirmer votre email avant de vous connecter",
      });
      break;
    case 'User already registered':
      toastFn({
        variant: "destructive",
        title: "Utilisateur déjà inscrit",
        description: "Un compte existe déjà avec cet email",
      });
      break;
    default:
      toastFn({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'authentification",
      });
  }
};

export type SignUpError = {
  message: string;
  status?: number;
}