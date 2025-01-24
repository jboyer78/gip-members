import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  onChange: (value: string) => void;
}

const EmailInput = ({ email, onChange }: EmailInputProps) => (
  <div>
    <Label htmlFor="reset-email">Adresse email</Label>
    <Input
      id="reset-email"
      type="email"
      value={email}
      onChange={(e) => onChange(e.target.value)}
      placeholder="exemple@email.com"
      required
      className="mt-1"
    />
  </div>
);

export default EmailInput;