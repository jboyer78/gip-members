import { useEffect, useState } from "react";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { BankingInfoFormValues } from "./types";
import { getBaseMembershipFee } from "@/utils/membershipFees";
import { Profile } from "@/integrations/supabase/types/profile";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface DebitAuthorizationProps {
  form: UseFormReturn<BankingInfoFormValues>;
}

export const DebitAuthorization = ({ form }: DebitAuthorizationProps) => {
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
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

        if (profile) {
          const status = profile.professional_status?.[0];
          setCurrentStatus(status || null);
          setDonationAmount(profile.donation_amount || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async (payload: RealtimePostgresChangesPayload<Profile>) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && payload.new && payload.new.id === user.id) {
            setCurrentStatus(payload.new.professional_status?.[0] || null);
            setDonationAmount(payload.new.donation_amount || null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAuthorizationText = () => {
    if (!currentStatus) return "J'autorise GROUPE INTERNATIONAL POLICE à prélever sur mon compte bancaire le montant de la cotisation annuelle de ...";
    
    let amount = "...";
    if (currentStatus === "Membre d'honneur") {
      amount = donationAmount ? `${donationAmount} €` : "...";
    } else {
      const fee = getBaseMembershipFee(currentStatus);
      amount = `${fee} €`;
    }
    
    return `J'autorise GROUPE INTERNATIONAL POLICE à prélever sur mon compte bancaire le montant de la cotisation annuelle de ${amount}`;
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
              {getAuthorizationText()}
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};