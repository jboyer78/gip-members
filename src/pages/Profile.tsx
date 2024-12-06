import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileFormFields } from "@/components/profile/ProfileFormFields";
import { useProfileForm } from "@/components/profile/useProfileForm";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { form, onSubmit } = useProfileForm();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Mes Informations personnelles</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gérez vos informations personnelles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link 
                to="/profile" 
                className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="text-white text-sm font-medium">JD</span>
              </Link>
            </div>
          </div>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <ProfileFormFields form={form} />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Enregistrer les modifications
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;