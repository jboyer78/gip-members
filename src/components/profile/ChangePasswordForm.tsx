import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validatePassword } from "@/utils/validation";

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify new password requirements
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        toast.error("Les nouveaux mots de passe ne correspondent pas");
        return;
      }

      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Le mot de passe actuel est incorrect");
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error("Une erreur est survenue lors de la modification du mot de passe");
        return;
      }

      toast.success("Votre mot de passe a été modifié avec succès");
      onSuccess();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Une erreur est survenue lors de la modification du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <p className="text-sm text-gray-500">
          Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*(),.?&quot;{}|&lt;&gt;)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
      </Button>
    </form>
  );
};