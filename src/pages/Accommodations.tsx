import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

const Accommodations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isVerified, isLoading: isLoadingAdmin } = useIsAdmin();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      if (!isLoadingAdmin && !isVerified && !isAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Votre compte doit être vérifié pour accéder à cette page",
        });
        navigate("/profile");
        return;
      }
    };

    checkAuth();
  }, [navigate, toast, isAdmin, isVerified, isLoadingAdmin]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Hébergements</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gérez les hébergements disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
            <p className="text-gray-600 dark:text-gray-400">Le contenu de cette page est en cours de développement.</p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Accommodations;