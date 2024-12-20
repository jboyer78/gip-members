import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { TopNavigation } from "@/components/shared/TopNavigation";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";

interface Publication {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  updated_at: string;
  is_published: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isVerified, isLoading: isLoadingAdmin } = useIsAdmin();
  const { toast } = useToast();

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

  const { data: publications, isLoading } = useQuery({
    queryKey: ["published-publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("is_published", true)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Publication[];
    },
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Actualités</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bienvenue sur votre fil d'actualités</p>
              </div>
            </div>
            <TopNavigation />
          </div>

          {isLoading ? (
            <div>Chargement des publications...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications?.map((publication) => (
                <article 
                  key={publication.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden relative"
                >
                  <AspectRatio ratio={16/6}>
                    {publication.image_url ? (
                      <img 
                        src={publication.image_url}
                        alt={publication.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        Pas d'image
                      </div>
                    )}
                  </AspectRatio>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{publication.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      {publication.content}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 absolute bottom-4 right-4">
                      {format(new Date(publication.updated_at), "dd/MM/yyyy", { locale: fr })}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;