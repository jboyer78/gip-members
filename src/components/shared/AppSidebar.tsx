import { CreditCard, ListPlus, LogOut, Newspaper, Settings, UserRound, Users } from "lucide-react";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupHeader, SidebarMenuItem } from "@/components/ui/sidebar";
import { LogoutButton } from "./sidebar/LogoutButton";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        <SidebarGroupHeader>Menu</SidebarGroupHeader>
        <SidebarGroupContent>
          <SidebarMenuItem
            to="/profile"
            icon={UserRound}
            label="Profil"
            className="mb-4"
          />
          {!isLoading && (isValidated || isAdmin) && (
            <>
              <SidebarMenuItem
                to="/card"
                icon={CreditCard}
                label="Carte"
                className="mb-4"
              />
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
                icon={Settings}
                label="Publications"
              />
            </>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
      <LogoutButton />
    </SidebarContent>
  );
};