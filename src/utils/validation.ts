export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins 6 caractères",
    };
  }
  return { isValid: true, message: "" };
};