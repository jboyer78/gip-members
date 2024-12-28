import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/profile";
import { BankingInfo } from "@/integrations/supabase/types/banking";

export const useProfilesWithBanking = (isLoading: boolean, profiles: Profile[] | null) => {
  return useQuery({
    queryKey: ['profilesWithBanking'],
    queryFn: async () => {
      if (!profiles) return [];
      
      // Récupérer toutes les informations bancaires en une seule requête
      const { data: bankingInfos } = await supabase
        .from('banking_info')
        .select('*');

      // Créer un map pour un accès rapide
      const bankingInfoMap = new Map(
        bankingInfos?.map(info => [info.profile_id, info]) || []
      );

      // Associer les informations bancaires aux profils
      return profiles.map(profile => ({
        ...profile,
        banking_info: bankingInfoMap.get(profile.id) || null
      }));
    },
    enabled: !isLoading && !!profiles,
    staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
    cacheTime: 1000 * 60 * 10, // Garde en cache pendant 10 minutes
  });
};