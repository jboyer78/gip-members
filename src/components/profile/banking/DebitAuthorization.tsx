import { useState, useEffect } from "react";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { BankingInfoFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { getBaseMembershipFee } from "@/utils/membershipFees";

interface DebitAuthorizationProps {
  form: UseFormReturn<BankingInfoFormValues>;
}

export const DebitAuthorization = ({ form }: DebitAuthorizationProps) => {
  const [membershipFee, setMembershipFee] = useState<number>(42);

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

  return (
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
              J'autorise GROUPE INTERNATIONAL POLICE à prélever sur mon compte bancaire le montant de la cotisation annuelle de : {membershipFee}€
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};