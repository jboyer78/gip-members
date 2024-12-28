import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/profile";

export const useProfilesWithBanking = (isLoading: boolean, profiles: Profile[] | null) => {
  return useQuery({
    queryKey: ['profiles-with-banking'],
    queryFn: async () => {
      console.log("Fetching profiles with banking info...");
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          banking_info (
            id,
            iban,
            bic,
            authorize_debit,
            created_at,
            updated_at,
            profile_id
          )
        `)
        .order('updated_at', { ascending: false })
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

      if (error) {
        console.error("Error fetching profiles with banking info:", error);
        throw error;
      }

      console.log("Profiles with banking info:", profiles);
      return profiles;
    },
    enabled: !isLoading && !!profiles
  });
};