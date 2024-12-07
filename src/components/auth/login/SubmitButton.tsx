import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton = ({ isLoading }: SubmitButtonProps) => (
  <Button type="submit" className="w-full" disabled={isLoading}>
    {isLoading ? "Connexion en cours..." : "Se connecter"}
  </Button>
);