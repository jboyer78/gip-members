import { Newspaper, User, ListPlus, Users, BookOpen, CreditCard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { LogoutButton } from "./sidebar/LogoutButton";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function AppSidebar() {
  const { isAdmin, isValidated, isLoading } = useIsAdmin();
  
  console.log("AppSidebar - isAdmin:", isAdmin);
  console.log("AppSidebar - isValidated:", isValidated);
  console.log("AppSidebar - isLoading:", isLoading);

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
            <SidebarMenuItem
              to="/profile"
              icon={User}
              label="Profil"
              className="mb-4"
            />
            {!isLoading && isValidated && (
              <SidebarMenuItem
                to="/card"
                icon={CreditCard}
                label="Carte"
                className="mb-4"
              />
            )}
            {!isLoading && isAdmin && (
              <>
                <SidebarMenuItem
                  to="/members"
                  icon={Users}
                  label="Membres"
                  className="mb-4"
                />
                <SidebarMenuItem
                  to="/publications"
                  icon={BookOpen}
                  label="Publications"
                  className="mb-4"
                />
              </>
            )}
            {!isLoading && (isValidated || isAdmin) && (
              <>
                <SidebarMenuItem
                  to="/dashboard"
                  icon={Newspaper}
                  label="Actualités"
                  className="mb-4"
                />
                <SidebarMenuItem
                  to="/accommodations"
                  icon={ListPlus}
                  label="Hébergements"
                />
              </>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}