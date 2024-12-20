import { useState, useEffect } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getBaseMembershipFee } from "@/utils/membershipFees";

interface BankingInfoFormValues {
  iban: string;
  bic: string;
  authorize_debit: boolean;
}

export const BankingInfoCard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [membershipFee, setMembershipFee] = useState<number>(42);
  const form = useForm<BankingInfoFormValues>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("professional_status")
          .eq("id", user.id)
          .single();

        if (profile?.professional_status?.[0]) {
          const fee = getBaseMembershipFee(profile.professional_status[0]);
          setMembershipFee(fee);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const onSubmit = async (values: BankingInfoFormValues) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // First check if a record exists
      const { data: existingRecord } = await supabase
        .from("banking_info")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      let error;
      
      if (existingRecord) {
        // Update existing record
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
        // Insert new record
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

  // Fetch existing banking info
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
        <FormField
          control={form.control}
          name="iban"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IBAN</FormLabel>
              <FormControl>
                <Input {...field} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BIC</FormLabel>
              <FormControl>
                <Input {...field} placeholder="BNPAFRPPXXX" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorize_debit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  J'autorise GROUPE INTERNATIONAL POLICE à effectuer sur mon compte bancaire le montant de la cotisation annuelle de {membershipFee} €
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
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