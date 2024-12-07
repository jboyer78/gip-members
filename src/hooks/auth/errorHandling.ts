import { toast } from "@/hooks/use-toast";
import { SignUpError } from "./types";

export const handleSignUpError = (error: SignUpError): void => {
  if (error.message.includes("rate limit") || error.status === 429) {
    toast({
      variant: "destructive",
      title: "Limite d'envoi atteinte",
      description: "Trop de tentatives d'inscription. Veuillez réessayer dans quelques minutes.",
    });
    return;
  }

  if (error.message.includes("User already registered")) {
    toast({
      variant: "destructive",
      title: "Erreur d'inscription",
      description: "Un compte existe déjà avec cette adresse email",
    });
    return;
  }

  toast({
    variant: "destructive",
    title: "Erreur d'inscription",
    description: "Une erreur est survenue lors de l'inscription",
  });
};