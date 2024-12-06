import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { TopNavigation } from "@/components/shared/TopNavigation";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Tableau de bord</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bienvenue sur votre tableau de bord</p>
              </div>
            </div>
            <TopNavigation />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Comment bien démarrer avec React</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Un guide complet pour comprendre les bases de React et commencer à développer des applications web modernes.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">5 min de lecture</span>
                <button className="text-primary hover:underline">Lire plus</button>
              </div>
            </article>
            
            <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Les meilleures pratiques Tailwind CSS</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Découvrez comment optimiser votre workflow avec Tailwind CSS et créer des interfaces utilisateur élégantes.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">7 min de lecture</span>
                <button className="text-primary hover:underline">Lire plus</button>
              </div>
            </article>
            
            <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">TypeScript pour les débutants</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Un aperçu des fonctionnalités essentielles de TypeScript et comment les utiliser dans vos projets.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">6 min de lecture</span>
                <button className="text-primary hover:underline">Lire plus</button>
              </div>
            </article>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;