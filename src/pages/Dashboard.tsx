import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { User, ListPlus } from "lucide-react";

const Dashboard = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full flex-col md:flex-row">
        <Sidebar variant="floating" className="w-full md:w-64 shrink-0">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/profile" className="flex items-center space-x-2 p-2 md:p-3">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Profil</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/annonces" className="flex items-center space-x-2 p-2 md:p-3">
                      <ListPlus className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Annonces</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger />
            <h1 className="text-xl md:text-2xl font-bold">Tableau de bord</h1>
          </div>
          <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-600">
            Bienvenue sur votre espace personnel
          </p>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;