import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { IosCardHeader } from "@/components/member-card/ios/IosCardHeader";
import { IosCardSide } from "@/components/member-card/ios/IosCardSide";
import { IosCardFooter } from "@/components/member-card/ios/IosCardFooter";

const IosMemberCard = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }

  const publicCardUrl = `https://gip-members.lovable.app/public-card/${profile.id}`;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <IosCardHeader />

            <ResizablePanelGroup 
              direction="vertical" 
              className="min-h-[1000px] rounded-lg border space-y-0 md:space-y-4"
            >
              <ResizablePanel defaultSize={50}>
                <IosCardSide 
                  type="front"
                  profile={profile}
                  backgroundImage="/lovable-uploads/76c591b5-d36e-4ac5-a4a3-9f2ba64321b4.png"
                />
              </ResizablePanel>

              <div className="h-4 block md:hidden" />

              <ResizablePanel defaultSize={50}>
                <IosCardSide 
                  type="back"
                  profile={profile}
                  publicCardUrl={publicCardUrl}
                  backgroundImage="/lovable-uploads/7fabfc2f-74f0-42fe-b42e-d38ff0226691.png"
                />
              </ResizablePanel>
            </ResizablePanelGroup>
            
            <IosCardFooter publicCardUrl={publicCardUrl} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default IosMemberCard;