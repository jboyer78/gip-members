import { Link } from "react-router-dom";
import { LayoutDashboard, User, ListPlus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="w-full md:w-64 shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg">
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
                <Link to="/dashboard" className="flex items-center space-x-4 p-4 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 group">
                  <LayoutDashboard className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">Tableau de bord</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="list-none mb-4">
              <SidebarMenuButton asChild>
                <Link to="/profile" className="flex items-center space-x-4 p-4 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 group">
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">Profil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton asChild>
                <a href="/annonces" className="flex items-center space-x-4 p-4 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 group">
                  <ListPlus className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">Annonces</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}