import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session found, redirecting to login...");
        navigate("/login");
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        
        // If session not found, we should still redirect to login
        if (error.message.includes("session_not_found")) {
          navigate("/login");
          return;
        }
        
        toast.error("Erreur lors de la déconnexion");
        return;
      }

      console.log("Successfully logged out");
      toast.success("Déconnexion réussie");
      navigate("/login");
      
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      toast.error("Erreur lors de la déconnexion");
      // In case of any error, we should still redirect to login
      navigate("/login");
    }
  };

  return (
    <SidebarMenuItem className="list-none">
      <SidebarMenuButton asChild>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-4 p-4 bg-red-50 hover:bg-red-200 rounded-lg transition-all duration-300 text-left group"
        >
          <LogOut className="h-6 w-6 text-red-600 group-hover:text-red-700" />
          <span className="text-lg font-medium text-gray-900 group-hover:text-red-700">
            Déconnexion
          </span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};