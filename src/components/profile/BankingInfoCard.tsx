import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BankingInfoFormValues {
  iban: string;
  authorize_debit: boolean;
}

export const BankingInfoCard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<BankingInfoFormValues>();

  const onSubmit = async (values: BankingInfoFormValues) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from("banking_info")
        .upsert({ 
          profile_id: user.id,
          iban: values.iban,
          authorize_debit: values.authorize_debit,
          updated_at: new Date().toISOString()
        });

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
          .select("iban, authorize_debit")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching banking info:", error);
          return;
        }
        
        if (data) {
          form.reset({ 
            iban: data.iban,
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
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations bancaires</h2>
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
                      J'autorise GROUPE INTERNATIONAL POLICE à effectuer sur mon compte bancaire le montant de la cotisation annuelle de 40 €
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
      </CardContent>
    </Card>
  );
};