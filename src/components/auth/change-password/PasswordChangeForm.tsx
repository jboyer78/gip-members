import { useState } from "react";
import PasswordField from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { validatePassword } from "@/utils/validation";

interface PasswordChangeFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const PasswordChangeForm = ({ onSubmit, isLoading, onCancel }: PasswordChangeFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(password, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <PasswordField
          id="new-password"
          label="Nouveau mot de passe"
          value={password}
          onChange={setPassword}
          showHelperText
        />

        <PasswordField
          id="confirm-password"
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </div>

      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
          disabled={isLoading}
        >
          Retour à la connexion
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;