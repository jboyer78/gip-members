import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const EmailField = ({ value, onChange, label }: EmailFieldProps) => (
  <div>
    <Label htmlFor="signUpEmail">{label}</Label>
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