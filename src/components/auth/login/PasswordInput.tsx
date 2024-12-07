import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

export const PasswordInput = ({ password, setPassword }: PasswordInputProps) => (
  <div>
    <Label htmlFor="password">Mot de passe</Label>
    <Input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="mt-1"
    />
  </div>
);