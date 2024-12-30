import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { CardSide } from "@/components/member-card/CardSide";
import { FrontCard } from "@/components/member-card/FrontCard";
import { BackCard } from "@/components/member-card/BackCard";

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Ma carte de membre</h1>
                </div>
              </div>
            </div>

            <ResizablePanelGroup 
              direction="vertical" 
              className="min-h-[1000px] rounded-lg border space-y-0 md:space-y-4"
            >
              <ResizablePanel defaultSize={50}>
                <CardSide>
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ 
                        backgroundImage: `url('/lovable-uploads/76c591b5-d36e-4ac5-a4a3-9f2ba64321b4.png')`,
                        WebkitBackfaceVisibility: 'hidden',
                        WebkitTransform: 'translate3d(0, 0, 0)',
                        WebkitPerspective: '1000',
                      }}
                    />
                    <div className="relative z-10">
                      <FrontCard profile={profile} />
                    </div>
                  </div>
                </CardSide>
              </ResizablePanel>

              <div className="h-4 block md:hidden" />

              <ResizablePanel defaultSize={50}>
                <CardSide>
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ 
                        backgroundImage: `url('/lovable-uploads/7fabfc2f-74f0-42fe-b42e-d38ff0226691.png')`,
                        WebkitBackfaceVisibility: 'hidden',
                        WebkitTransform: 'translate3d(0, 0, 0)',
                        WebkitPerspective: '1000',
                      }}
                    />
                    <div className="relative z-10">
                      <BackCard profile={profile} publicCardUrl={publicCardUrl} />
                    </div>
                  </div>
                </CardSide>
              </ResizablePanel>
            </ResizablePanelGroup>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              URL publique du QR code : {' '}
              <a 
                href={publicCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {publicCardUrl}
              </a>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default IosMemberCard;