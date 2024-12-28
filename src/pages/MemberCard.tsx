import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

const MemberCard = () => {
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

  const publicCardUrl = `${window.location.origin}/public-card/${profile.id}`;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Ma carte de membre</h1>

            <ResizablePanelGroup direction="vertical" className="min-h-[1000px] rounded-lg border">
              {/* Front of the card */}
              <ResizablePanel defaultSize={50}>
                <div className="h-full p-6">
                  <div className="relative h-full bg-white rounded-xl shadow-xl p-8">
                    <div className="relative h-full">
                      <img 
                        src="/lovable-uploads/7fabfc2f-74f0-42fe-b42e-d38ff0226691.png" 
                        alt="Card background" 
                        className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain rounded-xl"
                      />
                      <div className="relative z-10 h-full">
                        <div className="flex flex-col h-full">
                          <div className="flex-1 relative">
                            <div className="absolute top-[65%] left-28 space-y-1 transform scale-90 sm:scale-100 origin-top-left">
                              <p className="text-xs sm:text-sm md:text-base"><span className="font-semibold">Nom :</span> {profile.last_name}</p>
                              <p className="text-xs sm:text-sm md:text-base"><span className="font-semibold">Prénom :</span> {profile.first_name}</p>
                              <p className="text-xs sm:text-sm md:text-base"><span className="font-semibold">N°adhérent :</span> {profile.member_number}</p>
                            </div>
                            <div className="absolute top-31 sm:top-31 right-24 sm:right-28 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-100 overflow-hidden">
                              {profile.avatar_url ? (
                                <img 
                                  src={profile.avatar_url} 
                                  alt="Photo de profil" 
                                  className="w-full h-full object-cover border-2 border-black rounded"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  PHOTO
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ResizablePanel>

              {/* Back of the card */}
              <ResizablePanel defaultSize={50}>
                <div className="h-full p-6">
                  <div className="relative h-full bg-white rounded-xl shadow-xl p-8">
                    <img 
                      src="/lovable-uploads/c22c59c8-c1b1-4a6e-90f6-6039957c2112.png" 
                      alt="Card background" 
                      className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain rounded-xl"
                    />
                    <div className="relative z-10 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><span className="font-semibold">Adresse :</span> {profile.street}</p>
                        <p><span className="font-semibold">Code postal :</span> {profile.postal_code}</p>
                        <p><span className="font-semibold">Ville :</span> {profile.city}</p>
                        <p><span className="font-semibold">Pays :</span> {profile.country}</p>
                        <p><span className="font-semibold">Email :</span> {profile.email}</p>
                        <p><span className="font-semibold">Téléphone :</span> {profile.phone_mobile || profile.phone_home}</p>
                      </div>
                      <div className="flex justify-end items-center">
                        <QRCodeSVG 
                          value={publicCardUrl}
                          size={128}
                          level="H"
                          className="bg-white p-2 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MemberCard;