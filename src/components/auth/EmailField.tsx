import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const EmailField = ({ value, onChange }: EmailFieldProps) => (
  <div>
    <Label htmlFor="signUpEmail">Adresse email</Label>
    <Input
      id="signUpEmail"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="exemple@email.com"
      required
      className="mt-1"
    />
  </div>
);

export default EmailField;