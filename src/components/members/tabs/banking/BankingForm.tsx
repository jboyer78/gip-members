import { useState } from "react";
import { BankingInfo } from "@/integrations/supabase/types/banking";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface BankingFormProps {
  bankingInfo: BankingInfo | null;
  profileId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BankingForm = ({ bankingInfo, profileId, onCancel, onSuccess }: BankingFormProps) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, authorize_debit: checked as boolean }))
            }
          />
          <label 
            htmlFor="authorize_debit" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Autoriser le prélèvement automatique
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};