import { SidebarTrigger } from "@/components/ui/sidebar";
import { TopNavigation } from "@/components/shared/TopNavigation";

export const MembersHeader = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
    <div className="flex items-center gap-2">
      <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Membres</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Liste des membres de l'organisation</p>
      </div>
    </div>
    <TopNavigation />
  </div>
);