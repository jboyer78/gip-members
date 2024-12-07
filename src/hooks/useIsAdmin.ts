import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      console.log("Profile data:", data);
      
      return data;
    },
  });

  console.log("isAdmin value:", profile?.is_admin);

  return {
    isAdmin: profile?.is_admin || false,
    isLoading,
  };
};