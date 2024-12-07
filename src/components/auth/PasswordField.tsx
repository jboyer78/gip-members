import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showHelperText?: boolean;
}

const PasswordField = ({ id, label, value, onChange, showHelperText }: PasswordFieldProps) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="mt-1"
    />
    {showHelperText && (
      <p className="text-sm text-gray-500 mt-1">
        Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*(),.?{'"{}|<>')
      </p>
    )}
  </div>
);

export default PasswordField;