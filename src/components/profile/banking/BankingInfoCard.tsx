import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BankingInfoFormValues } from "./types";
import { BankingFormFields } from "./BankingFormFields";
import { DebitAuthorization } from "./DebitAuthorization";

export const BankingInfoCard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<BankingInfoFormValues>();

  const onSubmit = async (values: BankingInfoFormValues) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: existingRecord } = await supabase
        .from("banking_info")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      let error;
      
      if (existingRecord) {
        const { error: updateError } = await supabase
          .from("banking_info")
          .update({ 
            iban: values.iban,
            bic: values.bic,
            authorize_debit: values.authorize_debit,
            updated_at: new Date().toISOString()
          })
          .eq("profile_id", user.id);
          
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("banking_info")
          .insert({ 
            profile_id: user.id,
            iban: values.iban,
            bic: values.bic,
            authorize_debit: values.authorize_debit,
            updated_at: new Date().toISOString()
          });
          
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Informations bancaires mises à jour",
        description: "Vos informations bancaires ont été enregistrées avec succès",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating banking info:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des informations bancaires",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBankingInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("banking_info")
          .select("iban, bic, authorize_debit")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching banking info:", error);
          return;
        }
        
        if (data) {
          form.reset({ 
            iban: data.iban,
            bic: data.bic,
            authorize_debit: data.authorize_debit || false
          });
        }
      } catch (error) {
        console.error("Error fetching banking info:", error);
      }
    };

    fetchBankingInfo();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BankingFormFields form={form} />
        <DebitAuthorization form={form} />
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
};