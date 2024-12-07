import { toast } from "@/hooks/use-toast";

export const validatePasswords = (password: string, confirmPassword: string): boolean => {
  if (password !== confirmPassword) {
    toast({
      variant: "destructive",
      title: "Erreur de validation",
      description: "Les mots de passe ne correspondent pas",
    });
    return false;
  }
  return true;
};

export const validateCaptcha = (captchaToken: string | null): boolean => {
  if (!captchaToken) {
    toast({
      variant: "destructive",
      title: "Erreur de validation",
      description: "Veuillez compléter le CAPTCHA",
    });
    return false;
  }
  return true;
};