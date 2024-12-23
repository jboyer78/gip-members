import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface BankingFormFieldsProps {
  formData: {
    iban: string;
    bic: string;
    authorize_debit: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAuthorizeDebit: (checked: boolean) => void;
}

export const BankingFormFields = ({ formData, handleChange, setAuthorizeDebit }: BankingFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">IBAN</label>
        <Input
          name="iban"
          value={formData.iban}
          onChange={handleChange}
          placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">BIC</label>
        <Input
          name="bic"
          value={formData.bic}
          onChange={handleChange}
          placeholder="BNPAFRPPXXX"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="authorize_debit"
          checked={formData.authorize_debit}
          onCheckedChange={(checked) => setAuthorizeDebit(checked as boolean)}
        />
        <label 
          htmlFor="authorize_debit" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Autoriser le prélèvement automatique
        </label>
      </div>
    </div>
  );
};