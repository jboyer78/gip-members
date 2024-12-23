import { BankingInfo } from "@/integrations/supabase/types/banking";
import { BankingFormFields } from "./BankingFormFields";
import { BankingFormActions } from "./BankingFormActions";
import { useBankingForm } from "./useBankingForm";

interface BankingFormProps {
  bankingInfo: BankingInfo | null;
  profileId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BankingForm = ({ bankingInfo, profileId, onCancel, onSuccess }: BankingFormProps) => {
  const { formData, handleChange, setAuthorizeDebit, handleSubmit } = useBankingForm({
    bankingInfo,
    profileId,
    onSuccess,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BankingFormFields 
        formData={formData}
        handleChange={handleChange}
        setAuthorizeDebit={setAuthorizeDebit}
      />
      <BankingFormActions onCancel={onCancel} />
    </form>
  );
};