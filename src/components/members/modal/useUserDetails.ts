import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/profile";

interface UseUserDetailsProps {
  initialUser: Profile | null;
  open: boolean;
  onUpdate?: () => void;
}

export const useUserDetails = ({ initialUser, open, onUpdate }: UseUserDetailsProps) => {
  const [user, setUser] = useState<Profile | null>(initialUser);

  const { data: updatedUser, refetch } = useQuery({
    queryKey: ['user-with-banking', initialUser?.id],
    queryFn: async () => {
      if (!initialUser?.id) return null;
      
      console.log("Fetching user data with banking info for:", initialUser.id);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          banking_info!banking_info_profile_id_fkey (
            id,
            profile_id,
            iban,
            bic,
            authorize_debit,
            created_at,
            updated_at
          )
        `)
        .eq('id', initialUser.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }

      console.log("Fetched user data:", profiles);
      return profiles;
    },
    enabled: !!initialUser?.id && open
  });

  useEffect(() => {
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      setUser(initialUser);
    }
  }, [initialUser, updatedUser]);

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleProfileUpdate = async (updatedProfile: Profile) => {
    setUser(updatedProfile);
    if (onUpdate) {
      await onUpdate();
    }
    refetch();
  };

  return {
    user,
    handleProfileUpdate,
  };
};