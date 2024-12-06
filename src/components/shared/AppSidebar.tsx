import { Link, useNavigate } from "react-router-dom";
import { Newspaper, User, ListPlus, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar variant="floating" className="w-full md:w-64 shrink-0 bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg">
      <SidebarContent>
        <div className="flex justify-center p-4 mb-12">
          <img 
            src="/lovable-uploads/e17e4ca6-2674-4aa6-999e-4b76b7ae8f32.png" 
            alt="Logo GIP" 
            className="w-32 h-32"
          />
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuItem className="list-none mb-4">
              <SidebarMenuButton asChild>
                <Link to="/dashboard" className="flex items-center space-x-4 p-4 hover:bg-gray-700/90 rounded-lg transition-all duration-300">
                  <Newspaper className="h-6 w-6 text-gray-300 hover:text-white" />
                  <span className="text-lg font-medium text-gray-300 hover:text-white">Actualités</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="list-none mb-4">
              <SidebarMenuButton asChild>
                <Link to="/profile" className="flex items-center space-x-4 p-4 hover:bg-gray-700/90 rounded-lg transition-all duration-300">
                  <User className="h-6 w-6 text-gray-300 hover:text-white" />
                  <span className="text-lg font-medium text-gray-300 hover:text-white">Profil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton asChild>
                <a href="/annonces" className="flex items-center space-x-4 p-4 hover:bg-gray-700/90 rounded-lg transition-all duration-300">
                  <ListPlus className="h-6 w-6 text-gray-300 hover:text-white" />
                  <span className="text-lg font-medium text-gray-300 hover:text-white">Annonces</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-300 text-left"
            >
              <LogOut className="h-6 w-6 text-red-600" />
              <span className="text-lg font-medium text-gray-900">
                Déconnexion
              </span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}