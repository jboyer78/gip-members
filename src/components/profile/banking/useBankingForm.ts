import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BankingFormValues } from "./types";
import { 
  fetchUserBankingInfo, 
  checkExistingBankingInfo, 
  updateBankingInfo, 
  insertBankingInfo 
} from "./api/bankingApi";

export const useBankingForm = () => {
  const { toast } = useToast();
  const form = useForm<BankingFormValues>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBankingInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user found");
          return;
        }

        console.log("Fetching banking info for user:", user.id);
        const data = await fetchUserBankingInfo(user.id);
        
        if (data) {
          console.log("Fetched banking info:", data);
          form.reset({ 
            iban: data.iban || "",
            bic: data.bic || "",
            authorize_debit: data.authorize_debit || false
          });
        }
      } catch (error) {
        console.error("Error in fetchBankingInfo:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer vos informations bancaires"
        });
      }
    };

    fetchBankingInfo();
  }, [form, toast]);

  const onSubmit = async (values: BankingFormValues) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found during submit");
        return;
      }

      console.log("Checking existing banking info for user:", user.id);
      const existingRecord = await checkExistingBankingInfo(user.id);

      console.log("Existing record:", existingRecord);
      
      if (existingRecord) {
        console.log("Updating existing banking info");
        await updateBankingInfo(user.id, values);
      } else {
        console.log("Inserting new banking info");
        await insertBankingInfo(user.id, values);
      }

      toast({
        title: "Informations bancaires mises à jour",
        description: "Vos informations bancaires ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos informations bancaires",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};