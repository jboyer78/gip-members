import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { User, ListPlus } from "lucide-react";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/profile" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/annonces" className="flex items-center space-x-2">
                      <ListPlus className="h-4 w-4" />
                      <span>Annonces</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="mt-4 text-gray-600">Bienvenue sur votre espace personnel</p>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;