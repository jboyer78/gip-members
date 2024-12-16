import { toast } from "@/hooks/use-toast";

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "L'email est requis";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "L'email n'est pas valide";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Le mot de passe est requis";
  }
  if (password.length < 6) {
    return "Le mot de passe doit contenir au moins 6 caractères";
  }
  return null;
};

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