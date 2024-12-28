import { CreditCard, ListPlus, LogOut, Newspaper, Settings, UserRound, Users } from "lucide-react";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LogoutButton } from "./sidebar/LogoutButton";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AppSidebar = () => {
  const { isAdmin, isValidated, isLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log("No active session found, redirecting to login");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <SidebarContent>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuItem className="mb-4">
            <SidebarMenuButton asChild>
              <Link to="/profile" className="flex items-center space-x-4">
                <UserRound className="h-6 w-6 text-gray-300 hover:text-white" />
                <span className="text-lg font-medium text-gray-300 hover:text-white">Profil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!isLoading && (isValidated || isAdmin) && (
            <>
              <SidebarMenuItem className="mb-4">
                <SidebarMenuButton asChild>
                  <Link to="/card" className="flex items-center space-x-4">
                    <CreditCard className="h-6 w-6 text-gray-300 hover:text-white" />
                    <span className="text-lg font-medium text-gray-300 hover:text-white">Carte</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="mb-4">
                <SidebarMenuButton asChild>
                  <Link to="/dashboard" className="flex items-center space-x-4">
                    <Newspaper className="h-6 w-6 text-gray-300 hover:text-white" />
                    <span className="text-lg font-medium text-gray-300 hover:text-white">Actualités</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/accommodations" className="flex items-center space-x-4">
                    <ListPlus className="h-6 w-6 text-gray-300 hover:text-white" />
                    <span className="text-lg font-medium text-gray-300 hover:text-white">Hébergements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          {!isLoading && isAdmin && (
            <>
              <SidebarMenuItem className="mb-4">
                <SidebarMenuButton asChild>
                  <Link to="/members" className="flex items-center space-x-4">
                    <Users className="h-6 w-6 text-gray-300 hover:text-white" />
                    <span className="text-lg font-medium text-gray-300 hover:text-white">Membres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/publications" className="flex items-center space-x-4">
                    <Settings className="h-6 w-6 text-gray-300 hover:text-white" />
                    <span className="text-lg font-medium text-gray-300 hover:text-white">Publications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
      <LogoutButton />
    </SidebarContent>
  );
};