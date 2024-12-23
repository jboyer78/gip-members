import { useState } from "react";
import { BankingInfo } from "@/integrations/supabase/types/banking";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseBankingFormProps {
  bankingInfo: BankingInfo | null;
  profileId: string;
  onSuccess: () => void;
}

export const useBankingForm = ({ bankingInfo, profileId, onSuccess }: UseBankingFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    iban: bankingInfo?.iban || "",
    bic: bankingInfo?.bic || "",
    authorize_debit: bankingInfo?.authorize_debit || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setAuthorizeDebit = (checked: boolean) => {
    setFormData(prev => ({ ...prev, authorize_debit: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updateData = {
        profile_id: profileId,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (bankingInfo) {
        const { error: updateError } = await supabase
          .from("banking_info")
          .update(updateData)
          .eq("profile_id", profileId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("banking_info")
          .insert(updateData);
        error = insertError;
      }

      if (error) {
        console.error("Supabase error:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour des informations bancaires",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Les informations bancaires ont été mises à jour avec succès",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de la mise à jour des informations bancaires",
      });
    }
  };

  return {
    formData,
    handleChange,
    setAuthorizeDebit,
    handleSubmit,
  };
};