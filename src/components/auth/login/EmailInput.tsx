import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

export const EmailInput = ({ email, setEmail }: EmailInputProps) => (
  <div>
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="mt-1"
      placeholder="exemple@email.com"
    />
  </div>
);