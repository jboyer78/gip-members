import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['userAdminStatus'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAdmin: false, isVerified: false, status: null };

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, email_verified, status')
        .eq('id', user.id)
        .single();

      return {
        isAdmin: profile?.is_admin || false,
        isVerified: profile?.email_verified || false,
        status: profile?.status?.[0] || null
      };
    },
  });

  return {
    isAdmin: data?.isAdmin || false,
    isVerified: data?.isVerified || false,
    status: data?.status,
    isValidated: data?.status === 'Validée',
    isLoading,
  };
};