import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UsernameInputProps {
  username: string;
  setUsername: (username: string) => void;
}

export const UsernameInput = ({ username, setUsername }: UsernameInputProps) => (
  <div>
    <Label htmlFor="username">Identifiant</Label>
    <Input
      id="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
      className="mt-1"
    />
  </div>
);