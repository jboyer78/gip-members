import { useEffect, useState } from "react";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { BankingInfoFormValues } from "./types";
import { getBaseMembershipFee } from "@/utils/membershipFees";

interface DebitAuthorizationProps {
  form: UseFormReturn<BankingInfoFormValues>;
}

export const DebitAuthorization = ({ form }: DebitAuthorizationProps) => {
  const [membershipFee, setMembershipFee] = useState<number | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("professional_status, donation_amount")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.professional_status?.[0]) {
          const status = profile.professional_status[0];
          const fee = getBaseMembershipFee(status);
          setMembershipFee(fee);
          
          if (status === "Membre d'honneur" && profile.donation_amount) {
            setDonationAmount(profile.donation_amount);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const getFeeDisplay = () => {
    if (membershipFee === 0 && donationAmount) {
      return `${donationAmount} €`;
    }
    return membershipFee ? `${membershipFee} €` : "...";
  };

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
              J'autorise GROUPE INTERNATIONAL POLICE à effectuer sur mon compte bancaire le montant de la cotisation annuelle de {getFeeDisplay()}
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};