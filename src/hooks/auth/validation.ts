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

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?"{}\|<>]/.test(password);

  if (!hasUpperCase) {
    return "Le mot de passe doit contenir au moins une majuscule";
  }

  if (!hasLowerCase) {
    return "Le mot de passe doit contenir au moins une minuscule";
  }

  if (!hasNumbers) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }

  if (!hasSpecialChar) {
    return "Le mot de passe doit contenir au moins un caractère spécial";
  }
  
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return "La confirmation du mot de passe est requise";
  }

  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas";
  }

  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return "Le nom est requis";
  }

  if (name.length < 2) {
    return "Le nom doit contenir au moins 2 caractères";
  }

  return null;
};

export const validatePasswords = (password: string, confirmPassword: string): boolean => {
  const passwordError = validatePassword(password);
  if (passwordError) {
    toast({
      variant: "destructive",
      title: "Erreur de validation",
      description: passwordError,
    });
    return false;
  }

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