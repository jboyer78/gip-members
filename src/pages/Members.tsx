import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { MembersHeader } from "@/components/members/MembersHeader";
import { MembersTable } from "@/components/members/MembersTable";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const Members = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();

  // Check both authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      if (!isLoadingAdmin && !isAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Cette page est réservée aux administrateurs",
        });
        navigate("/dashboard");
      }
    };

    checkAuth();
  }, [navigate, toast, isAdmin, isLoadingAdmin]);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <MembersHeader />

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
            <MembersTable profiles={profiles} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Members;