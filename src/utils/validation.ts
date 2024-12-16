export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Le mot de passe doit contenir au moins ${minLength} caractères`,
    };
  }

  if (!hasUpperCase) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins une majuscule",
    };
  }

  if (!hasLowerCase) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins une minuscule",
    };
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins un chiffre",
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)",
    };
  }

  return { isValid: true, message: "" };
};

export const validatePasswords = (password: string, confirmPassword: string): boolean => {
  const passwordValidation = validatePassword(password);
  
  if (!passwordValidation.isValid) {
    return false;
  }

  if (password !== confirmPassword) {
    return false;
  }

  return true;
};