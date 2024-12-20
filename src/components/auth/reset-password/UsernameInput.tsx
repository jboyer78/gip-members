import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UsernameInputProps {
  username: string;
  onChange: (value: string) => void;
}

const UsernameInput = ({ username, onChange }: UsernameInputProps) => (
  <div>
    <Label htmlFor="reset-username">Identifiant</Label>
    <Input
      id="reset-username"
      type="text"
      value={username}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Votre identifiant"
      required
      className="mt-1"
    />
  </div>
);

export default UsernameInput;