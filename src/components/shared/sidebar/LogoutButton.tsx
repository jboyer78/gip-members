import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export const LogoutButton = () => {
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
  );
};