import { toast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { SignUpError } from "./types";

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

export const handleSignUpError = async (error: SignUpError): Promise<boolean> => {
  console.error('SignUp error:', error);
  
  // Parse the error body if it's a string
  let errorBody;
  try {
    if (typeof error.body === 'string') {
      errorBody = JSON.parse(error.body);
    }
  } catch (e) {
    console.error('Error parsing error body:', e);
  }

  const errorCode = errorBody?.code || error.message;
  
  switch (errorCode) {
    case 'over_email_send_rate_limit':
      toast({
        variant: "destructive",
        title: "Limite de tentatives atteinte",
        description: "Trop de tentatives d'inscription. Veuillez réessayer dans 5 minutes.",
      });
      return false;
    case 'User already registered':
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Un compte existe déjà avec cet email",
      });
      return false;
    case 'Password too short':
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return false;
    case 'Invalid email':
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "L'adresse email n'est pas valide",
      });
      return false;
    default:
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
      return false;
  }
};