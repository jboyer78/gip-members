import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

export const EmailInput = ({ email, setEmail }: EmailInputProps) => (
  <div>
    <Label htmlFor="email">Adresse email</Label>
    <Input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="exemple@email.com"
      required
      className="mt-1"
    />
  </div>
);